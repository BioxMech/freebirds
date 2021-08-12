import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import MyPopup from '../util/MyPopup';
import CommentLiked from '../assets/commentLiked.svg';
import CommentUnliked from '../assets/commentUnliked.svg';
import './styles.scss';

function CommentLikeButton ({ user, postId, commentsLikes, commentsLikesCount, commentId}) {

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && commentsLikes.find(cL => cL.username === user.username)) { // check if user exists + the liked (user) is === to the logged-in user
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, commentsLikes]); // dependency, if any of these variables changes, recalculate the value

  const [likePost] = useMutation(LIKE_COMMENT_MUTATION, {
    variables: { postId: postId, commentId: commentId }
  });

  const commentLikeButton = user ? (
    liked ? ( // if liked
      <IconButton color='teal'>
        <img src={CommentUnliked} alt="..." style={{ width: "30px" }} />
      </IconButton>
    ) : ( // if NOT liked
      <IconButton color='teal' basic>
        <img src={CommentLiked} alt="..." style={{ width: "30px" }} />
      </IconButton>
    )
  ) : ( // if user is not logged in
    <IconButton component="a" href="/login">
      <img src={CommentLiked} alt="..." style={{ width: "30px" }} />
    </IconButton>
  )
  return (
    <MyPopup
      content={ liked ? "Unlike" : "Like" }
    >
      <Button className="Button-NoBG" component='div' onClick={likePost} >
        { commentLikeButton }
        { commentsLikesCount }
      </Button>
    </MyPopup>
    
  )
}

const LIKE_COMMENT_MUTATION = gql `
  mutation likeComment($postId: ID!, $commentId: ID!) {
    likeComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        commentsLikes {
          id username
        }
        commentsLikesCount
      }
    }
  }
`

export default CommentLikeButton;