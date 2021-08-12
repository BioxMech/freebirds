import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
{
  getPosts {
    username id body createdAt likeCount
    likes {
      username
    }
    commentCount
    comments {
      id username createdAt body
    }
  }
}
`;

export const PROFILE_QUERY = gql `
query ($username: String!) {
  getUser(username: $username) {
    id email username createdAt
    posts {
      id body username createdAt likeCount commentCount
      likes {
        username
      }
      comments {
        id username createdAt body
        commentsLikes {
          id username
        }
        commentsLikesCount
      }
    }
    likedPosts {
      id body username createdAt likeCount commentCount
      likes {
        username
      }
      comments {
        id username createdAt body
        commentsLikes {
          id username
        }
        commentsLikesCount
      }
    }
    repliedPosts {
      id body username createdAt likeCount commentCount
      likes {
        username
      }
      comments {
        id username createdAt body
        commentsLikes {
          id username
        }
        commentsLikesCount
      }
    }
  }
}
`;