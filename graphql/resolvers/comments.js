const { UserInputError, AuthenticationError } = require('apollo-server-express');

const checkAuth = require('../../util/check-auth');
const Post = require('../../models/Post');

module.exports = {
  Mutation: {
    // context is needed to check if the user has login
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment body must not be empty'
          }
        })
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        })

        await post.save();
        return post;
      } else throw new UserInputError('Post not found');
    },

    // returns the post w/o the deleted comment
    async deleteComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex(comment => comment.id === commentId);

        // this will check if the user is the owner of the post
        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post; 
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } else {
        throw new UserInputError('Post not found');
      }
    },

    // Like and Unlike feature (like a social media app)
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        // user can only have 1 like on the post
        if (post.likes.find(like => like.username === username)) { // this check returns an object, undefined if cannot be found
          // Post already likes, unlike it
          post.likes = post.likes.filter(like => like.username !== username); // remove the current user 
        } else {
          // Not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          })
        }

        await post.save();
        return post;
      } else throw new UserInputError('Post not found');
    }
  }
}