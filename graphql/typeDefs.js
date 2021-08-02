const { gql } = new require('apollo-server');

module.exports = gql`
  type Post {
    id: ID! # object id that is created on MongoDB side
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID! # object id that is created on MongoDB side
    createdAt: String!
    username: String!
    body: String!
  }
  type Like {
    id: ID! # object id that is created on MongoDB side
    createdAt: String!
    username: String!
  }
  type User {
    id: ID! # object id that is created on MongoDB side
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  # This is required for the mutation (as a form)
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  # =========================================================
  type Query{
    getPosts: [Post]
    getPost(postId: ID!): Post
  }

  type Mutation {
    # method: returns
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }

  type Subscription {
    newPost: Post!
  }
`;