import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// import { FETCH_POSTS_QUERY } from '../util/graphql';

import MyPopup from '../util/MyPopup';
import Delete from '../assets/delete.svg';
import './styles.scss';

function DeleteButton({ postId, commentId, callback }) {

  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION; // if commentId exist = want to delete comment
  
  const [deletePostOrMutation] = useMutation(mutation, {
    update(cache, result) {
      setConfirmOpen(false);
      
    //   // You only want to delete the POST
    //   if (!commentId) {
    //     const data = cache.readQuery({
    //       query: FETCH_POSTS_QUERY
    //     });

    //     console.log(data)
  
    //     let newData = [...data.getPosts]; // You must make a copy of the state, otherwise it will crash (apollo writeQuery docs)
    //     newData = data.getPosts.filter(p => p.id !== postId); // keep all the post that we did not delete
    //     cache.writeQuery({
    //       query: FETCH_POSTS_QUERY, 
    //       data: {
    //         ...data,
    //         getPosts: {
    //           newData,
    //         },
    //       }, 
    //     }); 
    //   }

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
        <Button className='Button-NoBG' onTouchStart={(event) => event.stopPropagation()} onMouseDown={event => event.stopPropagation()} onClick={(event) => {setConfirmOpen(true); event.stopPropagation(); event.preventDefault();}} style={{ margin: 0, padding: 0 }}>
          <IconButton>
            <img src={Delete} alt="..." style={{ width: "26px" }} />
          </IconButton>
        </Button>
      </MyPopup>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle>
          Delete Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant="h6">
            Confirm to delete? (It's permanent)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={deletePostOrMutation} style={{ color: "red" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
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