import React, { useState } from 'react'
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';

import { FETCH_POSTS_QUERY } from '../util/graphql';
import { useForm } from '../util/hooks';

function PostForm() {

  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const { onChange, onSubmit, values } = useForm(createPostCallback, {
    body: ''
  });
  
  const [err, setErr] = useState(false);

  const [createPost, { error, loading }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      })

      let newData = [...data.getPosts];
      newData = [result.data.createPost, ...newData];
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          ...data,
          getPosts: { 
            newData,
          },
        },
      });

      // console.log(result);
      values.body = ''
      setOpen(true)
    }, 
    onError: (err) => {
      setErr(true);
    }
  })

  function createPostCallback() {
    createPost();
  }

  return (
    <form noValidate autoComplete="off" onSubmit={onSubmit}>
      <Box>
        <TextField 
          name="body"
          onChange={onChange}
          value={values.body}
          error={error ? true : false} 
          variant="outlined" 
          placeholder="Want to talk about it?" 
          label="Release your worries & Soar!" 
          helperText="Be a Free Bird!!"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          multiline
        />
      </Box>
      {/* TODO: Add a loader after submitting posts */}
      <Box mt={1}>
        <Button type="submit" 
          variant="outlined" 
          color="inherit" 
          disabled={(values.body === '' )  ? true : false}
          style={{
            backgroundColor: `${(values.body  === "" || loading) ? '' : "#84d4fc"}`,
            borderColor: `${(values.body  === "" || loading) ? '' : "white"}`,
          }}
          startIcon={ loading ? 
            <CircularProgress size="1.2rem" />
          : ''}
        >
          Submit
        </Button>
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Posted!
          </Alert>
        </Snackbar>
      </Box>
      
      { err && (
        <Box mt={1}>
          <Alert severity="error">{ error.graphQLErrors[0].message }</Alert>
        </Box>
      )}
    </form>
  )
}

const CREATE_POST_MUTATION = gql `
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id body createdAt username
      likes {
        id username createdAt
      }
      likeCount
      comments {
        id body username createdAt
      }
      commentCount
    }
  }
`

export default PostForm;
