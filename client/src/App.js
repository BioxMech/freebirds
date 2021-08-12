import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Container from '@material-ui/core/Container';

import './App.css';

import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute'; // it is used to redirect to "/" if logged in

import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SinglePost from './pages/SinglePost';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <MenuBar />
        <Container maxWidth="lg">
          <Switch>
            <Route exact path="/" component={Home} /> 
            <AuthRoute exact path="/login" component={Login} />
            <AuthRoute exact path="/register" component={Register} />
            <Route exact path="/posts/:postId" component={SinglePost} />
            <AuthRoute exact path="/profile/:username" component={Profile} userLoggedIn="true" />
            <AuthRoute exact path="/settings" component={Settings} userLoggedIn="true" />
            <AuthRoute exact path="/changePassword" component={ChangePassword} userLoggedIn="true" />
            <Redirect to="/" /> 
          </Switch>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
