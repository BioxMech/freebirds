import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/auth';

function AuthRoute({ component: Component, userLoggedIn, ...rest}) { // props : name (the right word "name" is naming the props)
  
  const { user } = useContext(AuthContext);

  let output;

  // FIXME: Checks if the user is logged in ????? (smth is wrong here)
  if (userLoggedIn) {
    output = 
    <Route 
      { ...rest } 
      render={props => !user ? <Redirect to="/login" /> : <Component { ...props } /> }
    />
  } else {
    output = 
    <Route 
      { ...rest } 
      render={props => user ? <Redirect to="/" /> : <Component { ...props } /> }
    />
  }

  return output;
} 

export default AuthRoute;

