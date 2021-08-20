import React, { useContext, useState } from 'react';
import gql from 'graphql-tag';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    newConfirmPassword: "",
    profilePicture: ""
  });

  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    update(_, { data}) { // if mutation is successful, it will execute this
      context.login(data.updateUser); // context LOGIN
      setSuccess(true);
      setTimeout(() => {
        props.history.push("/")
      }, 3000)
    }, 
    onError(err) {
      if (err.graphQLErrors)
        // console.log(err.graphQLErrors[0].extensions.errors);
        setErrors(err.graphQLErrors[0].extensions.errors);
        alert("Sorry bug encountered! Please alert the admin asap!!");
        setTimeout(() => {
          props.history.push('/');
        }, 3000);
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
      fontSize: '2.5rem', // laptop
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '3rem', // monitor
    },
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword)
  };

  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const anyErrors = 
  (values.password === "" || values.password.length < 6) ||
  (values.newPassword === "" || values.newPassword.length < 6) ||
  (values.newConfirmPassword === "" || values.newConfirmPassword.length < 6);

  let settings;

  if (PLoading || !PData || PError) {

    settings = Loading_screen({ content: "Allowing you to change passwords..." });

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
                  Change Password
                </Box>
              </Typography>
            </ThemeProvider>
            <form onSubmit={onSubmit} noValidate >
              <Box mt={3}>
                <TextField 
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  onChange={onChange}
                  value={values.password}
                  error={
                    (errors.password || (values.password.length < 6 && values.password.length > 0)) ? true : false
                  }
                  variant="outlined" 
                  placeholder="Your Current FreeBird password" 
                  label="Current Password" 
                  helperText={
                    (errors.password) ? "Incorrect password" : "What is your current password?"
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  InputProps= {{
                    endAdornment: 
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }}
                  />
              </Box>
              <Box mt={3}>
                <TextField 
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  onChange={onChange}
                  value={values.newPassword}
                  error={
                    (errors.newPassword || (values.newPassword.length < 6 && values.newPassword.length > 0)) ? true : false
                  }
                  variant="outlined" 
                  placeholder="Your Password (minimum 6 characters)" 
                  label="New Password" 
                  helperText={
                    (errors.newPassword) ? "Invalid new password" : "What shall be your new password? (minimum 6 characters)"
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  InputProps= {{
                    endAdornment: 
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowNewPassword}
                        onMouseDown={handleMouseDownNewPassword}
                      >
                        {showNewPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }}
                  />
              </Box>
              <Box mt={3}>
                <TextField 
                  name="newConfirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  onChange={onChange}
                  value={values.newConfirmPassword}
                  error={
                    (errors.newConfirmPassword || (values.newConfirmPassword.length < 6 && values.newConfirmPassword.length > 0)) ? true : false
                  }
                  variant="outlined" 
                  placeholder="Confirm your password (minimum 6 characters)" 
                  label="Confirm New Password" 
                  helperText={
                    (errors.newConfirmPassword) ? "Incorrect confirmation of your password" : "~ Please double confirm your new password (minimum 6 characters) ~"
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  InputProps= {{
                    endAdornment: 
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownConfirmPassword}
                      >
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }}
                  />
              </Box>
              <Box mt={2}>
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
                  Change
                </Button>
              </Box>
            </form> 
            {/* Display Errors */}
            { Object.keys(errors).length > 0 
              ?
              (
              <div className="ui error message">
                { Object.values(errors).map((value) => (
                  <Box mt={3}>
                    <Alert key={value} severity="error">{value}</Alert>
                  </Box>
                ))}
              </div>
              ) : ''
            }
            <Backdrop className={classes.backdrop} open={ loading ? true : false }>
              <CircularProgress color="inherit" />
            </Backdrop>
            { 
              success ?
              <Box mt={3}>
                <Alert severity="success">Password Changed successfully!!</Alert>
                <Snackbar open={true} autoHideDuration={6000}>
                  <Alert severity="info">
                    Redirecting to Home in 3 seconds ...
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