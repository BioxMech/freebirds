import React, {  } from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
// import { AuthContext } from '../context/auth';
import { useQuery } from '@apollo/client';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import { motion } from "framer-motion"

import PostCard from '../components/PostCard';
import Calendar from '../assets/calendar.svg';
import Medal from '../assets/medal.svg';
import Post from '../assets/post.svg';
import Loading_screen from '../util/Loading';

function Profile (props) {

  const username = props.match.params.username; // JSON format (username of the profile)

  // const { user } = useContext(AuthContext); // logged-in user

  const { loading, data, error } = useQuery(PROFILE_QUERY, {
    variables: {
      username: username
    }
  })

  // If the user does not exist, you should kick the person out / display error message
  function nonExistingProfile() {
    props.history.push('/');
  }

  const theme = createTheme();

  theme.typography.h3 = {
    fontSize: '1.5rem', // mobile
    '@media (min-width:600px)': {
      fontSize: '2rem', // laptop
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '3rem', // monitor
    },
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <>
            {children}
          </>
        )}
      </div>
    );
  }

  let profile;

  if (loading || !data || error) {

    profile = Loading_screen({ content: "Fetching your profile..." });

    if (error) {
      nonExistingProfile();
      // TODO: For future references (there are more errors)
      // if (error.graphQLErrors[0].message === "Error: User not found") {
      //   nonExistingProfile();
      // } 
    }
  } else {

    const { username, createdAt, posts, likedPosts, repliedPosts } = data.getUser;

    profile = (
      <Box mt={5}>
        <Grid container>
          <Grid xs={12} item>
            <Box mb={5}>
              <motion.div
                initial={{ x: -500 }}
                animate={{ x: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 50
                }}
                whileHover={{ scale: 1.03 }}
              >
                <Paper elevation={15}>
                  <Grid container>
                    <Grid xs={4} item>
                      <Box display="flex" justifyContent="center" mx={3} my={3}>
                        <Avatar aria-label="recipe" src='https://react.semantic-ui.com/images/avatar/large/molly.png' 
                          style={{ width: "100%", height: "100%", maxWidth: "200px", maxHeight: "200px", minWidth: "80px", minHeight: "80px" }} 
                        />
                      </Box>
                    </Grid>
                    <Grid xs={8} item>
                      <Box my={2}>
                        <Box my={1}>
                            <ThemeProvider theme={theme}>
                              <Typography variant="h3">
                                <i>{ username }</i>
                              </Typography>
                            </ThemeProvider>
                          
                        </Box>
                        <Box display="flex" alignItems="center">
                          <img src={Calendar} alt="..." style={{ width: "30px" }} /> &nbsp; { `Joined ${moment(createdAt).format("LL")}` }
                        </Box>
                        <Box display="flex" alignItems="center">
                          <img src={Medal} alt="..." style={{ width: "30px" }} /> &nbsp; Rank: &nbsp; <strong>Hatchling</strong>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <img src={Post} alt="..." style={{ width: "30px" }} /> &nbsp; Posted: &nbsp; <strong>{ posts.length }</strong>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </motion.div>
            </Box>
          </Grid>
          <Grid container spacing={1}>
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab label={`Posts (${posts.length})`} {...a11yProps(0)} />
                <Tab label={`Comments (${repliedPosts.length})`} {...a11yProps(1)} />
                <Tab label={`Likes (${likedPosts.length})`} {...a11yProps(2)} />
              </Tabs>
            </AppBar>
            
            { loading ? 
              (
                <h1>Loading Posts...</h1>
              ) : 
              (
                <SwipeableViews
                  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                  index={value}
                  onChangeIndex={handleChangeIndex}
                  style={{ width: "100%" }}
                >
                  {/* Created Post of the Profile */}
                  <Box mx={2} my={2} >
                    <TabPanel value={value} index={0} dir={theme.direction} >
                      { posts && posts.length !== 0 ? posts.map((post) => (
                        <Grid item xs={12} key={post.id}>
                          <Box mt={3}>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 0.98 }}
                              transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 50
                              }}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{
                                scale: 0.9,
                                borderRadius: "100%"
                              }}
                            >
                              <Paper elevation={5}>
                                <PostCard post={post} />
                              </Paper>
                            </motion.div>
                          </Box>
                        </Grid>
                      )) : (
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <Box style={{ textAlign: "center" }} mt={2}>
                            <img src="https://media.giphy.com/media/xThta6TFeC2j229JNm/source.gif" alt="..." style={{ width: "250px" }} />
                            <Typography variant="body1">
                              Click <Link to="/">Here</Link> to start posting!
                            </Typography>
                          </Box>
                        </Box>
                      )
                      }
                    </TabPanel>
                  </Box>

                  {/* Commented Post of the Profile */}
                  <Box mx={2} my={2}>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                      { repliedPosts && repliedPosts.length !== 0 ? repliedPosts.map((post) => (
                        <Grid item xs={12} key={post.id}>
                          <Box mt={3}>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 0.98 }}
                              transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                              }}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{
                                scale: 0.9,
                                borderRadius: "100%"
                              }}
                            >
                              <Paper elevation={5}>
                                <PostCard post={post} />
                              </Paper>
                            </motion.div>
                          </Box>
                        </Grid>
                      )) :
                        <Box display="flex" alignItems="center" justifyContent="center" style={{ height: "40vh" }}>
                          <Box style={{ textAlign: "center" }}>
                            <img src="https://media.giphy.com/media/iOoTB0LvnZdW6Z5MhW/source.gif" alt="..." style={{ width: "270px" }} />
                            <Typography variant="body1">
                              Click <Link to="/">Here</Link> to start posting!
                            </Typography>
                          </Box>
                        </Box>
                      }
                    </TabPanel>
                  </Box>

                  {/* Liked Post of the Profile */}
                  <Box mx={2} my={2}>
                    <TabPanel value={value} index={2} dir={theme.direction}>
                      { likedPosts && likedPosts.length !== 0 ? likedPosts.map((post) => (
                        <Grid item xs={12} key={post.id}>
                          <Box mt={3}>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 0.98 }}
                              transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                              }}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{
                                scale: 0.9,
                                borderRadius: "100%"
                              }}
                            >
                              <Paper elevation={5}>
                                <PostCard post={post} />
                              </Paper>
                            </motion.div>
                          </Box>
                        </Grid>
                      )) : (
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <Box style={{ textAlign: "center" }}>
                            <img src="https://c.tenor.com/UL-guPyYxxYAAAAi/raf-rafs.gif" alt="..." style={{ width: "183px" }} />
                            <Typography variant="body1">
                              Click <Link to="/">Here</Link> browse posts made by other Birds (users) !!
                            </Typography>
                          </Box>
                        </Box>
                      )
                      }
                    </TabPanel>
                  </Box>
                </SwipeableViews>
              )
            }
            
          </Grid>
        </Grid>
      </Box>
    )
  }

  return profile;
}

const PROFILE_QUERY = gql `
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

export default Profile