import React, { useContext } from 'react';
import gql from 'graphql-tag';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { AuthContext } from '../context/auth';
import { makeStyles } from '@material-ui/core/styles';
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

import Comment from '../assets/comment_color.svg';
import MyPopup from '../util/MyPopup';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import { CardActionArea } from '@material-ui/core';


function PostCard({ post: { body, createdAt, id, username, likeCount, commentCount, likes }}) {
  
  const { user } = useContext(AuthContext);

  const { data = { getUser: {createdAt: ''}} } = useQuery(PROFILE_QUERY, {
    variables: {
      username: username
    }
  })

  
  function deletePostCallback() {
    window.location.reload();
  }
  
  const useStyles = makeStyles((theme) => ({
    root: {
      height: "100%"
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    }
  }));

  const classes = useStyles();

  return (
    <Card className={classes.root} raised>
      <CardActionArea href={`/posts/${id}`}>
        <CardHeader
          avatar={
            <MyPopup content={`Joined on ${moment(data.getUser.createdAt).add(8, "hours").format('dddd, MMMM Do YYYY')} (${moment(createdAt).fromNow()})`} placement="top-start" >
              <Avatar aria-label="recipe" src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
            </MyPopup>
          }
          title={ username }
          subheader={ `Posted on ${moment(createdAt).add(8, "hours").format('LLL')} (${moment(createdAt).fromNow()})` }
          action={ user && user.username === username && 
          <DeleteButton postId={id} onMouseDown={event => event.stopPropagation()}
            onClick={event => {
              event.stopPropagation();
              event.preventDefault();
              console.log("Button clicked");
            }}
            callback={deletePostCallback} 
            /> } 
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
      </CardActionArea>
    </Card>
  )
}

const PROFILE_QUERY = gql `
  query ($username: String!) {
    getUser(username: $username) {
      createdAt
    }
  }
`;

export default PostCard