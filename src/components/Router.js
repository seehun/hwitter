import React, { useState } from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Navigation from './Navigation';
import Profile from '../routes/Profile';

const AppRouter = (props) => {
  return (
    <Router>
      {props.login_state && <Navigation userObj={props.userObj} />}
      <Switch>
        {props.login_state ? (
          <>
            <Route exact path='/'>
              <Home userObj={props.userObj} />
            </Route>
            <Route exact path='/profile'>
              <Profile
                userObj={props.userObj}
                refreshUser={props.refreshUser}
              />
            </Route>
          </>
        ) : (
          <>
            <Route exact path='/'>
              <Auth />
            </Route>
            <Redirect from='*' to='/' />
          </>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
