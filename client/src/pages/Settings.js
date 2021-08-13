import React, { useContext, useState } from 'react';
import gql from 'graphql-tag';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

import SettingsIcon from '../assets/settings.svg';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { useQuery, useMutation } from '@apollo/client';
import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';
import Loading_screen from '../util/Loading';
import { PROFILE_QUERY } from '../util/graphql';
import './styles.scss';

function Settings(props) {

  const context = useContext(AuthContext); // Holds the LOGIN or LOGOUT (context.user -> to get the logged-in user)

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  const { loading: PLoading, data: PData, error: PError } = useQuery(PROFILE_QUERY, {
    variables: {
      username: context.user.username
    }
  });

  const { onChange, onSubmit, values } = useForm(updateUserCallback, {
    username: context.user.username,
    email: context.user.email,
    password: "",
    newPassword: "",
    newConfirmPassword: ""
  });

  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    update(_, { data }) { // if mutation is successful, it will execute this
      setSuccess(true);
      context.login(data.updateUser);
      setTimeout(() => {
        props.history.push("/")
      }, 600)

    }, 
    onError(err) {
      if (err.graphQLErrors)
        // console.log(err.graphQLErrors[0].extensions.errors);
        setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values // values because it has all the values needed
  })
  function updateUserCallback() {
    updateUser();
  }

  function nonExistingProfile() {
    props.history.push('/');
  };

  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));

  const classes = useStyles();
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

  theme.typography.h4 = {
    fontSize: '1.5rem', // mobile
    '@media (min-width:600px)': {
      fontSize: '2rem', // laptop
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '3rem', // monitor
    },
  }

  const anyErrors = 
  (values.password === "" || values.password.length < 6) ||
  (values.email.length < 6 && values.email.length >= 0);

  let settings;

  if (PLoading || !PData || PError) {

    settings = Loading_screen({ content: "Fetching your settings..." });

    if (PError) {
      nonExistingProfile();
      // TODO: For future references (there are more errors)
      // if (error.graphQLErrors[0].message === "Error: User not found") {
      //   nonExistingProfile();
      // } 
    }
  } else {
    settings = 
    <Box mt={5}>
      <Container maxWidth="sm">
        <Paper elevation={5} square={false} style={{ borderRadius: "15px", paddingTop: "1px", paddingBottom: "1px" }}>
          <Box mx={5} my={3}>
            <ThemeProvider theme={theme}>
              <Typography variant="h3" >
                <Box display="flex" alignItems="center" >
                  Account Settings &nbsp; <img src={SettingsIcon} alt="..." style={{ width: "20%", maxWidth: "40px" }} />
                </Box>
              </Typography>
            </ThemeProvider>
            
            <form onSubmit={onSubmit} noValidate >
              <Box mt={3} >
                {/* <TextField 
                  name="username"
                  value={context.user.username}
                  variant="filled" 
                  placeholder="Your username" 
                  label="Username" 
                  helperText="FreeBird username"
                  InputLabelProps={{
                    shrink: true,
                    readOnly: true
                  }}
                  fullWidth
                  /> */}
                  <Box display="flex">
                    <Paper elevation={6} style={{ padding: "2.2%"}}>
                      <ThemeProvider theme={theme}>
                        <Typography variant="h4">
                          <span className="cursive"><b>Hello { context.user.username },</b></span>
                        </Typography>
                      </ThemeProvider>
                    </Paper>
                  </Box>
              </Box>
              <Box mt={4}>
                <TextField 
                  name="email"
                  type="email"
                  onChange={onChange}
                  value={values.email}
                  error={
                    (errors.email) ? true : false
                  }
                  variant="outlined" 
                  placeholder="Your email" 
                  label="Email" 
                  helperText={
                    (errors.email) ? "Invalid Email" : "What will your FreeBird Email be?"
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
                    (errors.password) ? true : false
                  }
                  variant="outlined" 
                  placeholder="Your FreeBird Account Password" 
                  label="Password" 
                  helperText={
                    (errors.password) ? "Incorrect password" : "What is your current FreeBird account password?"
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  />
              </Box>
              <Box mt={2} display="flex">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Button type="submit" 
                      variant="outlined" 
                      color="inherit" 
                      disabled={(
                        anyErrors
                      ) ? true : false }
                      style={{
                        backgroundColor: `${anyErrors ? '' : "#84d4fc"}`,
                        borderColor: `${anyErrors ? '' : "white"}`,
                      }}
                    >
                      Update
                    </Button>
                  </Grid>
                  <Grid item xs={12} >
                    <Button
                      href="/changePassword"
                      variant="outlined" 
                      color="inherit" 
                      style={{
                        backgroundColor: `${"#84d4fc"}`,
                        borderColor: `${"white"}`,
                      }}
                      endIcon={<ArrowRightIcon />}
                    >
                      To Change Password
                    </Button>
                  </Grid>
                </Grid>
                
              </Box>
            </form> 
            
            {/* Display Errors */}
            { Object.keys(errors).length > 0 && (
              <div className="ui error message">
              <ul className="list">
                { Object.values(errors).map((value) => (
                  <li key={value}>{ value }</li>
                ))}
              </ul>
            </div>
            )}
            <Backdrop className={classes.backdrop} open={ loading ? true : false }>
              <CircularProgress color="inherit" />
            </Backdrop>
            { 
              success ?
              <Box mt={3}>
                <Alert severity="success">Account successfully updated!!</Alert>
              </Box>
              : ''
            }
          </Box>
        </Paper>
        
      </Container>
    </Box>
  }

  return settings;
}

const UPDATE_USER = gql`
  mutation updateUser (
    $username: String!
    $email: String!
    $password: String!
    $newPassword: String!
    $newConfirmPassword: String!
  ) {
    updateUser(
      updateUserInput: {
        username: $username
        email: $email
        password: $password
        newPassword: $newPassword
        newConfirmPassword: $newConfirmPassword
      }
    ){
      id email username createdAt token
    }
  }
`

export default Settings;