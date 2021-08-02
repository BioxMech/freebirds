import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

import { FETCH_POSTS_QUERY } from '../util/graphql';

import MyPopup from '../util/MyPopup';

import { Button, Confirm, Icon } from 'semantic-ui-react';

function DeleteButton({ postId, commentId, callback }) {

  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION; // if commentId exist = want to delete comment

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);

      // You only want to delete the POST
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        });
  
        let newData = [...data.getPosts]; // You must make a copy of the state, otherwise it will crash (apollo writeQuery docs)
        newData = data.getPosts.filter(p => p.id !== postId); // keep all the post that we did not delete
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY, 
          data: {
            ...data,
            getPosts: {
              newData,
            },
          }, 
        }); 
      }

      if (callback) callback(); // postcard do not have a callback to this function
    },
    variables: {
      postId,
      commentId // this would be ignored if you want to delete the POST
    }
  })

  return (
    <>
      <MyPopup
        content={ commentId ? 'Delete Comment' : 'Delete post'} // You can pass a message into this function too
      >
        <Button as="div" color="red" floated="right" onClick={() => setConfirmOpen(true)}>
          <Icon name="trash" style={{ margin:0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  )
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: String!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;