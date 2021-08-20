const { model, Schema } = require('mongoose');

const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [
    {
      image: String,
      body: String,
      username: String,
      createdAt: String,
      profilePicture: String,
      commentsLikes: [
        {
          username: String,
          createdAt: String
        }
      ]
    }
  ],
  likes: [
    {
      username: String,
      createdAt: String
    }
  ],
  
  // allows the ability to use mongo codes to populate the schema
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
})

module.exports = model('Post', postSchema)