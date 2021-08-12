import React, { useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { FETCH_POSTS_QUERY } from '../util/graphql';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { motion } from "framer-motion"
import CircularProgress from '@material-ui/core/CircularProgress';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';

import Loading_screen from '../util/Loading';
import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import './styles.scss';

function Home() {

  const { user } = useContext(AuthContext);

  const { loading, data: { getPosts: posts } = {}, refetch } = useQuery(FETCH_POSTS_QUERY);

  const [rLoading, setRLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const successHandleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessOpen(false);
  };

  if (rLoading) {
    if (!loading) {
      setRLoading(false); 
      setOpen(false);
      setTimeout(function() { 
        setRLoading(false); 
        setOpen(false);
        setSuccessOpen(true);
      }, 300);
    }
  }

  return (
    <Box>
      <Grid container>
        { user && (
          <Grid item xs={12}>
            <Paper elevation={15} style={{ borderRadius: "10px", shadow: "red" }}>
              <Box mt={5} py={3} mx={5}>
                <Box mb={3}>
                  <Typography variant="h5">
                    <strong>Post Something!</strong>
                  </Typography>
                </Box>
                <PostForm />
              </Box>
            </Paper>
          </Grid> 
        )}
        <Grid item xs={12}>
          <Box my={5}>
            <Typography variant="h4" >
              Recent Posts 
              {
                !loading ? (
                  <Button variant="outlined" onClick={() => {refetch(); setRLoading(true); handleClick();}} style={{
                    marginLeft: "10px",
                    backgroundColor: `${rLoading ? '' : "#84d4fc"}`,
                    // borderColor: `${rLoading ? '' : "white"}`,
                    borderColor: 'black'
                  }}
                  startIcon={ rLoading ? 
                    <CircularProgress size="1.2rem" />
                  : ''}
                  >
                    { rLoading ? "Refreshing..." : "Refresh!" }
                  </Button>
                ) : ""
              }
            </Typography>
            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="info">
                Refetching!
              </Alert>
            </Snackbar>
            <Snackbar open={successOpen} autoHideDuration={2000} onClose={successHandleClose}>
              <Alert onClose={successHandleClose} severity="success">
                Refetch!
              </Alert>
            </Snackbar>
          </Box>
        </Grid>
        <Grid container spacing={3}>
        
          { loading ? 
            (

              <> 
              {/* <Box mx={"auto"} mt={3} display="flex" alignItems="center" justifyContent="center" >
                <Box style={{ textAlign: "center" }}> 
                  <img src="https://media.giphy.com/media/OjI3iowbHLmoY7n98e/source.gif" alt="..." style={{ width: "200px"}} />
                  <Typography variant="h3">
                    Fetching free birds posts ...
                  </Typography>
                </Box>
              </Box> */}
                {Loading_screen({ content: "Fetching free birds posts ...", boxHeight: "40vh"} )}
              </>
            ) : 
            (
              posts && posts.map((post) => (
                <Grid item xs={12} sm={6} key={post.id}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{
                      scale: 1.0,
                      borderRadius: "100%"
                    }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                </Grid>
              ))
            )
          }
        </Grid>
        
      </Grid>
    </Box>
  )
}

export default Home;