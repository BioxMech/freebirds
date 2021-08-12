import React, { useContext, useState } from 'react';
// import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Login(props) {

  const context = useContext(AuthContext); // Holds the LOGIN or LOGOUT

  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: ""
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData }}) { // if mutation is successful, it will execute this
      // console.log(userData);
      context.login(userData); // context LOGIN
      props.history.push('/');
    }, 
    onError(err) {
      if (err.graphQLErrors)
        // console.log(err.graphQLErrors[0].extensions.errors);
        setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values // values because it has all the values needed
  })

  function loginUserCallback() {
    loginUser();
  }

  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));

  const classes = useStyles();
  const theme = createTheme();

  theme.typography.h3 = {
    fontSize: '2rem', // mobile
    '@media (min-width:600px)': {
      fontSize: '2.5rem', // laptop
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '3rem', // monitor
    },
  };
  
  return (
    <Box mt={5}>
      <Container maxWidth="sm">
        <Paper elevation={5} square={false} style={{ borderRadius: "15px", paddingTop: "1px", paddingBottom: "1px" }}>
          <Box mx={5} my={5}>
            <ThemeProvider theme={theme} >
              <Typography variant="h3" >
                LOGIN
              </Typography>
            </ThemeProvider>
            <form onSubmit={onSubmit} noValidate >
              <Box mt={3}>
                <TextField 
                  name="username"
                  onChange={onChange}
                  value={values.username}
                  error={
                    (errors.username || errors.general === "User not found") ? true : false
                  }
                  variant="outlined" 
                  placeholder="Your username" 
                  label="Username" 
                  helperText={
                    (errors.username || errors.general === "User not found") ? "Incorrect/Invalid username" : "What is your FreeBird username?"
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  />
              </Box>
              <Box mt={3}>
                <TextField 
                  name="password"
                  type="password"
                  onChange={onChange}
                  value={values.password}
                  error={
                    (errors.password || errors.general === "Wrong credentials") ? true : false
                  }
                  variant="outlined" 
                  placeholder="Your Password" 
                  label="Password" 
                  helperText={
                    (errors.password || errors.general === "Wrong credentials") ? "Incorrect password" : "What is your secret password?"
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  />
              </Box>
              <Box mt={2}>
                <Button type="submit" 
                  variant="outlined" 
                  color="inherit" 
                  disabled={(values.username === "" || values.password === "") ? true : false}
                  style={{
                    backgroundColor: `${(values.username === "" || values.password === "") ? '' : "#84d4fc"}`,
                    borderColor: `${(values.username === "" || values.password === "") ? '' : "white"}`,
                  }}
                >
                  Login
                </Button>
              </Box>
            </form> 
            {/* Display Errors */}
            { Object.keys(errors).length > 0 && (
              <Box mt={3}>
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                      {
                        (errors.username || errors.general === "User not found") ? 
                          <Typography variant="body1"><b>{"->"}</b> Username is not registered. Click <a href="/register">here</a> to register</Typography>
                        : ""
                      }
                      {
                        (errors.password || errors.general === "Wrong credentials") ?
                          <Typography variant="body1"><b>{"->"}</b> Password is incorrect</Typography>
                        : ""
                      }
                    {/* { Object.values(errors).map((value) => (
                      
                    ))}
                     */}
                </Alert>
              </Box>
              
            )}
            <Backdrop className={classes.backdrop} open={ loading ? true : false }>
              <CircularProgress color="inherit" />
            </Backdrop>
          </Box> 
        </Paper>
      </Container>
    </Box>
  )
}

const LOGIN_USER = gql`
  mutation login (
    $username: String!
    $password: String!
  ) {
    login (
      username: $username
      password: $password
    ) {
      id email username createdAt token
    }
  }
`

export default Login;