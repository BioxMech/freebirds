import React, { useEffect, useState } from 'react';
import { Label, Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import MyPopup from '../util/MyPopup';

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
    variables: { postId: id }
  });

  const likeButton = user ? (
    liked ? ( // if liked
      <Button color='teal'>
        <Icon name='heart' />
      </Button>
    ) : ( // if NOT liked
      <Button color='teal' basic>
        <Icon name='heart' />
      </Button>
    )
  ) : ( // if user is not logged in
    <Button as={Link} to="/login" color='teal' basic>
      <Icon name='heart' />
    </Button>
  )

  return (
    <MyPopup
      content={ liked ? "Unlike" : "Like" }
    >
      <Button as='div' labelPosition='right' onClick={likePost}>
        { likeButton }
        <Label basic color='teal' pointing='left'>
          { likeCount }
        </Label>
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