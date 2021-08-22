import React, { useContext, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Alert from '@material-ui/lab/Alert';
import gql from 'graphql-tag';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import { green } from '@material-ui/core/colors';
import Paper from '@material-ui/core/Paper';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';
import './styles.scss';

function Register(props) {

  const context = useContext(AuthContext); // Holds the LOGIN or LOGOUT

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [preview, setPreview] = useState('');

  const { onChange, onSubmit, onDone, values } = useForm(registerUser, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
  
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData }}) { // if mutation is successful, it will execute this
      // console.log(userData);
      context.login(userData);
      props.history.push('/');
    }, 
    onError(err) {
      if (err.graphQLErrors)
        console.log(err)
        console.log(err.graphQLErrors)
        // console.log(err.graphQLErrors[0].extensions.errors);
        setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values // values because it has all the values needed
  })

  function registerUser() {
    addUser();
  }
  
  const { data: QData  } = useQuery(CHECK_USERNAME_QUERY, {
    variables: {
      username: values.username
    }
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
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
    fontSize: '2rem', // mobile
    '@media (min-width:600px)': {
      fontSize: '2.5rem', // laptop
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '3rem', // monitor
    },
  };

  let usernameExist;

  if (QData) {
    usernameExist = true;
  } else {
    usernameExist = false;
  }

  const anyErrors = 
  (values.password === "" || values.password.length < 6) ||
  (values.confirmPassword === "" || values.confirmPassword.length < 6) ||
  (values.username.length < 4 && values.username.length >= 0) ||
  values.username.length > 10 ||
  (values.email.length < 6 && values.email.length >= 0) || 
  usernameExist;

  // const UPLOAD_FILE = gql `
  //   mutation uploadFile($file: Upload!) {
  //     uploadFile(file: $file) {
  //       url
  //     }
  //   }
  // `

  // const [uploadFile] = useMutation(UPLOAD_FILE, {
  //   onCompleted: (data) => console.log(data)
  // })

  // const handleFileChange = e => {
  //   const file = e.target.files[0];
  //   if (!file) return
  //   onDone(file);
  //   uploadFile({ variables: { file } })
  // }

  return (
    <Box mt={5}>
      <Container maxWidth="sm">
        <Paper elevation={5} square={false} style={{ borderRadius: "15px", paddingTop: "1px", paddingBottom: "1px" }}>
          <Box mx={5} my={3}>
            <ThemeProvider theme={theme}>
              <Typography variant="h3" >
                <Box display="flex" alignItems="center" >BE A FREEBIRD <img src="https://media.giphy.com/media/FawHVOfqiLeLBmNdtl/source.gif" alt="..." style={{ width: "80px" }} /></Box>
              </Typography>
            </ThemeProvider>
            <form onSubmit={onSubmit} noValidate enctype="multipart/form-data">
              <Box mt={3}>
                <TextField 
                  name="username"
                  onChange={onChange}
                  value={values.username}
                  error={
                    (usernameExist || (values.username.length < 4 && values.username.length > 0) || values.username.length > 10 ) ? true : false
                  }
                  variant="outlined" 
                  placeholder="Your username" 
                  label="Username" 
                  helperText={
                    (errors.username) ? "Username taken" : `What is your UNIQUE FreeBird username? (Limit to 4 - 10 characters)`
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  InputProps={{
                    endAdornment: 
                    <InputAdornment position="end">
                      {
                        values.username === "" ? ("") :
                          usernameExist || (values.username.length < 4 && values.username.length > 0) || values.username.length > 10 ? (
                            <CancelIcon color="error" />
                          ) : (
                            <CheckCircleIcon style={{ color: green[500] }} />
                          )
                      }
                    </InputAdornment>,
                  }}
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
                {/* <FileBase64
                  type="file"
                  multiple={false}
                  onDone={e => checkFileSize(e)}
                /> */}
                { values.image ? <Box my={1}><Button variant="outlined" color="secondary" size="small" startIcon={<CancelIcon color="error" />}>Remove</Button></Box> : ''}
                { fileError ? <Box my={1}><Alert severity="error">File size is over the limit / invalid file</Alert></Box> : '' }
              </Box>
              <Box mt={3}>
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
                  type={showPassword ? 'text' : 'password'}
                  onChange={onChange}
                  value={values.password}
                  error={
                    (errors.password || (values.password.length < 6 && values.password.length > 0)) ? true : false
                  }
                  variant="outlined" 
                  placeholder="Your Password (minimum 6 characters)" 
                  label="Password" 
                  helperText={
                    (errors.password) ? "Invalid password" : "What is your secret password? (minimum 6 characters)"
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
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  onChange={onChange}
                  value={values.confirmPassword}
                  error={
                    (errors.confirmPassword || (values.confirmPassword.length < 6 && values.confirmPassword.length > 0)) ? true : false
                  }
                  variant="outlined" 
                  placeholder="Confirm your password (minimum 6 characters)" 
                  label="Confirm Password" 
                  helperText={
                    (errors.confirmPassword) ? "Incorrect confirmation of your password" : "~ Please confirm your password (minimum 6 characters) ~"
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
                  Register
                </Button>
              </Box>
            </form> 
            {/* Display Errors */}
            { Object.keys(errors).length > 0 && (
              <div className="ui error message">
              <ul className="list">
                { Object.values(errors).map((value) => (
                  <Box mt={3}>
                    <Alert key={value} severity="error">{value}</Alert>
                  </Box>
                ))}
              </ul>
            </div>
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

const REGISTER_USER = gql`
  mutation register (
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $profilePicture: Upload!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword,
        profilePicture: $profilePicture
      }
    ){
      id email username createdAt token profilePicture
    }
  }
`

const CHECK_USERNAME_QUERY = gql`
  query ($username: String!) {
    getUser(username: $username) {
      username
    }
  }
`;

export default Register;