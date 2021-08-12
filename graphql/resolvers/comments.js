const { UserInputError, AuthenticationError } = require('apollo-server-express');

const checkAuth = require('../../util/check-auth');
const Post = require('../../models/Post');
const User = require('../../models/User');

module.exports = {
  Mutation: {
    // context is needed to check if the user has login
    createComment: async (_, { postId, body }, context) => {
      const { id, username } = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment body must not be empty'
          }
        })
      }

      const post = await Post.findById(postId);
      const userAccount = await User.findById(id);

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        })

        if (userAccount.repliedPosts.find(post => post.id === postId)) {
          
        } else {
          userAccount.repliedPosts.push(post);
          await userAccount.save();
        }

        await post.save();
        return post;
      } else throw new UserInputError('Post not found');
    },

    // returns the post w/o the deleted comment
    async deleteComment(_, { postId, commentId }, context) {
      const { id, username } = checkAuth(context);

      const post = await Post.findById(postId);
      const userAccount = await User.findById(id);

      if (post) {
        const commentIndex = post.comments.findIndex(comment => comment.id === commentId);

        // this will check if the user is the owner of the post
        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          
          if (userAccount.repliedPosts.find(rPost => rPost.id === postId)) {
            if (post.comments.find(comment => comment.username === userAccount.username)) {

            } else {
              userAccount.repliedPosts = userAccount.repliedPosts.filter(post => post.id !== postId); // remove from user schema
              await userAccount.save(); // save it
            }
          }

          
          return post; 
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } else {
        throw new UserInputError('Post not found');
      }
    },

    // Like and Unlike of a post (like a social media app)
    async likePost(_, { postId }, context) {
      const { id, username } = checkAuth(context);

      const post = await Post.findById(postId);
      const user = await User.findById(id);

      if (post) {
        // user can only have 1 like on the post
        if (post.likes.find(like => like.username === username)) { // this check returns an object, undefined if cannot be found
          // Post already likes, unlike it
          post.likes = post.likes.filter(like => like.username !== username); // remove the current user 
          user.likedPosts = user.likedPosts.filter(like => like.id !== postId);
          // console.log("unliked")
        } else {
          // Not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          })

          user.likedPosts.push(post)
          // console.log("liked")
        }

        await user.save();
        await post.save();

        return post;
      } else throw new UserInputError('Post not found');
    },

    // Like and Unlike a comment
    async likeComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex(comment => comment.id === commentId);
        
        if (post.comments[commentIndex].commentsLikes.find(like => like.username === username)) {
          post.comments[commentIndex].commentsLikes = post.comments[commentIndex].commentsLikes.filter(like => like.username !== username);
        } else {
          post.comments[commentIndex].commentsLikes.push({
            username,
            createdAt: new Date().toISOString()
          })
        }

        await post.save();
        return post;
        // this will check if the user is the owner of the post
        // if (post.comments[commentIndex].username === username) {
        //   post.comments.splice(commentIndex, 1);
        //   await post.save();
        //   return post; 
        // } else {
        //   throw new AuthenticationError('Action not allowed');
        // }

      } else {
        throw new UserInputError('Post not found');
      }
    },
  }
}