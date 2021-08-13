import React, { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';
import Comment from '../assets/comment_color.svg';
import MyPopup from '../util/MyPopup';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import CommentLikeButton from '../components/CommentLikeButton';
import Calendar from '../assets/calendar.svg';
import Medal from '../assets/medal.svg';
import './styles.scss';
import Loading_screen from '../util/Loading';

function SinglePost(props) {

  const postId = props.match.params.postId; // JSON format
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  var username = ''

  const { data, loading, error } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  if (data) {
    username = data.getPost.username;
    console.log(data)
  }

  const { data: PData } = useQuery(PROFILE_QUERY, {
    variables: {
      username: username
    }
  })


  const { onChange, onSubmit, values } = useForm(submitCommentCallback, {
    comment: ""
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      values.comment = ""
      console.log("submitted")
    },
    variables: {
      postId,
      body: values.comment
    }
  })

  function submitCommentCallback() {
    submitComment();
  }

  function deletePostCallback() {
    props.history.push('/');
  }

  let postMarkup;

  if (loading || error) {

    postMarkup = Loading_screen("Fetching the post...");
    // If post cannot be found
    if (error) {
      deletePostCallback();
      // TODO: For future references (there are more errors)
      // if (error.graphQLErrors[0].message === "Error: Post not found") {
      //   deletePostCallback();
      // } 
    }
    
  } else {
    const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost;

    postMarkup = (
      <Box mt={5}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3} md={2}>
            <Paper elevation={10}>
            <Grid container >
              <MyPopup content={`To ${username} profile`} placement="top">
                <Grid item xs={6} sm={12}>
                  <Link to={`/profile/${username}`}>
                    <img src="https://react.semantic-ui.com/images/avatar/large/molly.png" alt="..." style={{ width: "100%"}} />
                  </Link>
                </Grid>
              </MyPopup>
              {
                PData ? 
                <Grid item xs={6} sm={12} >
                  <Box my={1} mx={1} >
                    <Box>
                      <Typography variant="h6" ><span className="cursive"><b>{ PData.getUser.username }</b></span></Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <img src={Calendar} alt="..." style={{ width: "24px" }} /> &nbsp; 
                      <Typography variant="body2">
                        { `Joined ${moment(PData.getUser.createdAt).format("ll")}` }
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <img src={Medal} alt="..." style={{ width: "24px" }} /> &nbsp; 
                      <Typography variant="body2">
                        Rank: <strong>Hatchling</strong>
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                : 
                ""
              }
            </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={9} md={10}>
            <Card raised>
              {/* <Link to={`/posts/${id}`}> */}
              <CardHeader
                // avatar={
                //   <MyPopup content={`Joined on ${moment(createdAt).format('dddd, MMMM Do YYYY')} (${moment(createdAt).fromNow()})`} placement="top-start" ><Avatar aria-label="recipe" src='https://react.semantic-ui.com/images/avatar/large/molly.png' /></MyPopup>
                // }
                title={ <Typography variant="h5" style={{ fontWeight: "bold" }}>{username}</Typography> }
                subheader={ `${moment(createdAt).add(8, "hours").format('MMMM Do YYYY, h:mm:ss a')} (${moment(createdAt).fromNow()})` }
                action={ user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              />
              {/* <CardMedia
                className={classes.media}
                image="/static/images/cards/paella.jpg"
                title="Paella dish"
              /> */}
              <Divider />
                <CardContent >
                  <Typography variant="subtitle1" color="textPrimary" component="p">
                    { body }
                  </Typography>
                </CardContent>
                <Divider />
              <CardActions>
                <LikeButton user={ user } post={{ id, likes, likeCount }} />
                <Box mr={"auto"}>
                  <MyPopup content="Comment" >
                    { user ? (
                      <Button className="Button-NoBG" component='a' href={`/posts/${id}`} >
                        <IconButton >
                          <img src={Comment} alt="..." style={{ width: "30px" }} />
                        </IconButton>
                        { commentCount }
                      </Button>
                    ) : (
                      <Button className="Button-NoBG" component='a' href={`/login`} >
                        <IconButton >
                          <img src={Comment} alt="..." style={{ width: "30px" }} />
                        </IconButton>
                        { commentCount }
                      </Button>
                    )}
                  </MyPopup>
                </Box>
              </CardActions>
            </Card>

            {/* Need to be logged in to post a Comment */}
            { user && 
              <Box mt={3}>
                <Card elevation={3}>
                  <CardContent>
                    <Box mb={2}>
                      <Typography variant="h6">
                        Post a comment
                      </Typography>
                    </Box>
                    <form onSubmit={onSubmit} noValidate autoComplete="off">
                      <TextField 
                        name="comment"
                        onChange={onChange}
                        value={values.comment}
                        error={error ? true : false} 
                        ref={commentInputRef}
                        variant="outlined" 
                        placeholder="What do you want to comment about?" 
                        label="Comment" 
                        helperText="Anything you want to talk about this post ~"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        multiline
                      />
                      <Box mt={1}>
                        <Button type="submit" 
                          variant="outlined" 
                          color="inherit" 
                          disabled={values.comment.trim() === ''}
                          style={{
                            backgroundColor: `${values.comment.trim() === ''? '' : "#84d4fc"}`,
                            borderColor: `${values.comment.trim() === '' ? '' : "white"}`,
                          }}
                        >
                          Submit
                        </Button>
                      </Box>
                    </form>
                  </CardContent>
                </Card>
              </Box>
            }

            {/* Delete OR Like A Comment */}
            { comments.map((comment) => (
              <Box mt={2}>
                <Card fluid key={comment.id}>
                  <CardHeader
                    avatar={
                      <MyPopup content={`Joined on ${moment(comment.createdAt).add(8, "hours").format('dddd, MMMM Do YYYY')} (${moment(comment.createdAt).fromNow()})`} placement="top-start" ><Avatar aria-label="recipe" src='https://react.semantic-ui.com/images/avatar/large/molly.png' /></MyPopup>
                    }
                    title={ comment.username }
                    subheader={ `Replied at ${moment(comment.createdAt).add(8, "hours").format('MMMM Do YYYY, h:mmA')} (${moment(comment.createdAt).fromNow()})` }
                    action={ 
                      <Box>
                        <CommentLikeButton user={user} postId={id} commentId={comment.id} commentsLikes={comment.commentsLikes} commentsLikesCount={comment.commentsLikesCount} />
                        {user && user.username === comment.username && ( <DeleteButton postId={id} commentId={comment.id} /> )}
                      </Box>
                    }
                  />
                  <Divider />
                  <CardContent >
                    <Box>
                      <Box>
                        <Typography variant="body1">
                          { comment.body }
                        </Typography>
                      </Box>
                    </Box>
                    
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Box>
      
    )
  }

  return postMarkup
}

const SUBMIT_COMMENT_MUTATION = gql `
  mutation ($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id body createdAt username
      }
      commentCount
    }
  }
`

const FETCH_POST_QUERY = gql `
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id body createdAt username likeCount
      likes {
        username
      }
      commentCount
      comments {
        id username createdAt body
        commentsLikes {
          id username
        }
        commentsLikesCount
      }
    }
  }
`

const PROFILE_QUERY = gql `
  query ($username: String!) {
    getUser(username: $username) {
      username
      posts {
        id
      }
    }
  }
`;

export default SinglePost;