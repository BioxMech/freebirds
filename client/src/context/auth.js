import React, { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
  user: null
};

if (localStorage.getItem('jwtToken')) {
  const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));

  // Check if token is expired
  if (decodedToken.exp * 1000 < Date.now()) {  // 1 hour expiration time
    localStorage.removeItem('jwtToken');
  } else {
    // Token not expired so you assign the current token to user state
    initialState.user = decodedToken; 
  }
}

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {}
})

// Redux, receives an action type and payload - then do something based on it
function authReducer(state, action) {
  // console.log("authReducer");
  switch(action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  // console.log("AuthProvider executed")
  const [state, dispatch] = useReducer(authReducer, initialState); // user's initial state
  // console.log(state.user) // has to be state.user as this is the saved state from the reducer

  // How reducer work: (Sequence of execution)
  // login > authReducer (dispatch) > AuthProvider
  function login(userData) { 
    localStorage.setItem("jwtToken", userData.token);
    // console.log("AuthProvider LOGIN")
    dispatch({  // dispatch will initiate authReducer function
      type: 'LOGIN',
      payload: userData
    });
  }

  function logout() {
    localStorage.removeItem('jwtToken');
    // console.log("AuthProvider LOGOUT")
    dispatch({  // dispatch will initiate authReducer function
      type: 'LOGOUT'
    });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      { ...props }
    />
  )
}

export { AuthContext, AuthProvider };