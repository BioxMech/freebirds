const Post = require('../../models/Post');
const User = require('../../models/User');
const checkAuth = require('../../util/check-auth');

const { AuthenticationError } = require('apollo-server-express');
const { argsToArgsConfig } = require('graphql/type/definition');

const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

module.exports = {
  Query: {
    async getPosts() {
      try {
        // no condition in () will find ALL
        const posts = await Post.find().sort({ createdAt: -1 }); // -1 means reverse for mongoDB; 
        return posts;
      } catch(err) {
        throw new Error(err);
      }
    },
    
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch(err) {
        throw new Error(err);
      }
    }
  },

  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);
      // console.log(user);

      const userAccount = await User.findById(user.id);

      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      })

      const post = await newPost.save();
      userAccount.posts.push(post);
      await userAccount.save();

      // publish the post (subscriber apollo)
      pubsub.publish('NEW_POST', {
        newPost: post
      })
      // console.log(context.pubsub)

      return post;
    },

    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);
      const userAccount = await User.findById(user.id);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          userAccount.posts = userAccount.posts.filter(post => post.id !== postId); // remove from user schema
          await userAccount.save(); // save it

          for await (const account of User.find({ 'likedPosts._id' : postId })) {
            account.likedPosts = account.likedPosts.filter(likedPost => likedPost.id !== postId)
            await account.save();
          }
    
          for await (const account of User.find({ 'repliedPosts._id' : postId })) {
            account.repliedPosts = account.repliedPosts.filter(repliedPost => repliedPost.id !== postId)
            await account.save();
          }
          
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        } 
      } catch (err) {
        throw new Error(err)
      }
    }
  },

  Subscription: {
    newPost: {
      // subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
      subscribe: () => pubsub.asyncIterator(['NEW_POST']),
    }
  }
}