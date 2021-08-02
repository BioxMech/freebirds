import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/auth';

function AuthRoute({ component: Component, ...rest}) { // props : name (the right word "name" is naming the props)
  
  const { user } = useContext(AuthContext);

  return (
    <Route 
      { ...rest } 
      render={props => user ? <Redirect to="/" /> : <Component { ...props } /> }
    />
  )
} 

export default AuthRoute;

