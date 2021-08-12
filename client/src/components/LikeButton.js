import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import MyPopup from '../util/MyPopup';
import LikedIcon from '../assets/like.svg';
import UnlikedIcon from '../assets/unlike.svg';
import './styles.scss';

function LikeButton ({ user, post: { id, likes, likeCount }}) {

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find(like => like.username === user.username)) { // check if user exists + the liked (user) is === to the logged-in user
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]); // dependency, if any of these variables changes, recalculate the value

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  const likeButton = user ? (
    liked ? ( // if liked
      <IconButton>
        <img src={UnlikedIcon} alt="..." style={{ width: "30px" }} />
      </IconButton>
    ) : ( // if NOT liked
      <IconButton>
        <img src={LikedIcon} alt="..." style={{ width: "30px" }} />
      </IconButton>
    )
  ) : ( // if user is not logged in
    <IconButton component="a" href="/login">
      <img src={LikedIcon} alt="..." style={{ width: "30px" }} />
    </IconButton>
  )

  return (
    <MyPopup
      content={ liked ? "Unlike" : "Like" }
    >
      <Button className="Button-NoBG" component='div' 
        onTouchStart={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          likePost(); 
          event.stopPropagation(); 
          if (user) {
            event.preventDefault();
          } 
        } }
      >
        { likeButton }
        { likeCount }
      </Button>
    </MyPopup>
    
  )
}

const LIKE_POST_MUTATION = gql `
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id username
      }
      likeCount
    }
  }
`

export default LikeButton;