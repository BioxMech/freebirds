import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router'
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
import Snackbar from '@material-ui/core/Snackbar';

import CancelIcon from '@material-ui/icons/Cancel';
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

  const history = useHistory()
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState('');
  const [fileError, setFileError] = useState(false);

  const { loading: PLoading, data: PData, error: PError } = useQuery(PROFILE_QUERY, {
    variables: {
      username: context.user.username
    }
  });

  const { onChange, onSubmit, onDone, values } = useForm(updateUserCallback, {
    username: context.user.username,
    email: "",
    password: "",
    newPassword: "",
    newConfirmPassword: "",
    profilePicture: ""
  });

  function checkFileSize(event) {
    const file = event.target.files[0];
    if (!file) return
    // 10 mb max
    if (file.size <= 10000000) {
      onDone(file);
      setPreview(URL.createObjectURL(event.target.files[0]))
    } else {
      setFileError(true);
    }
  }

  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    update(_, { data }) { // if mutation is successful, it will execute this
      setSuccess(true);
      context.login(data.updateUser);
      setTimeout(() => {
        history.go(0)
      }, 3000)

    }, 
    onError(err) {
      if (err.graphQLErrors) {
        console.log(err.graphQLErrors)
        setErrors(err.graphQLErrors[0].extensions.errors);
        alert("Sorry bug encountered! Please alert the admin asap!!");
        setTimeout(() => {
          props.history.push('/');
        }, 3000);
      }
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
    
    if (values.email === '') {
      values.email = PData.getUser.email;
    }
    
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
            
            <form onSubmit={onSubmit} noValidate enctype="multipart/form-data" >
              <Box mt={3} >
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
              <Box my={3}>
                <Typography variant="body1" style={{ marginBottom: "10px" }}>
                  <span style={{textDecoration: 'underline'}}>Profile Picture </span><br/>
                  <Typography variant="body2">(Max 10 MB) PNG/JPEG only</Typography>
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  style={{
                    backgroundColor: "#84d4fc",
                    // borderColor: "white",
                  }}

                >
                  Upload Picture
                  <input
                    type="file"
                    hidden
                    onChange={checkFileSize}
                    accept="image/gif, image/jpeg, image/png"
                  />
                </Button>
                { values.profilePicture ? 
                  <Box my={1}>
                    <Box mb={1}>
                      <b>Preview</b>
                    </Box>
                    <Box display="flex">
                      <img src={preview} alt="..." style={{ width: '35px' }} />
                      {/* TODO: Add in a remove image button */}
                      {/* <Button variant="outlined" color="secondary" size="small" startIcon={<CancelIcon color="error" />}>Remove</Button> */}
                      {/* <IconButton color="secondary"><CancelIcon color="error" /></IconButton> */}
                    </Box>
                  </Box>
                  :
                  ""
                }
                { values.image ? <Box my={1}><Button variant="outlined" color="secondary" size="small" startIcon={<CancelIcon color="error" />}>Remove</Button></Box> : ''}
                { fileError ? <Box my={1}><Alert severity="error">File size is over the limit / invalid file</Alert></Box> : '' }
              </Box>
              <Box mt={5}>
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
                  label="Password Verification" 
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
                { Object.values(errors).map((value) => (
                  <Box mt={3}>
                    <Alert key={value} severity="error">{ value }</Alert>
                  </Box>
                ))}
            </div>
            )}
            <Backdrop className={classes.backdrop} open={ loading ? true : false }>
              <CircularProgress color="inherit" />
            </Backdrop>
            { 
              success ?
              <Box mt={3}>
                <Alert severity="success">Account successfully updated!!</Alert>
                <Snackbar open={true} autoHideDuration={6000}>
                  <Alert severity="info">
                    Refreshing in 3 seconds ...
                  </Alert>
                </Snackbar>
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
    $profilePicture: Upload!
  ) {
    updateUser(
      updateUserInput: {
        username: $username
        email: $email
        password: $password
        newPassword: $newPassword
        newConfirmPassword: $newConfirmPassword
        profilePicture: $profilePicture
      }
    ){
      id email username createdAt token profilePicture
    }
  }
`

export default Settings;