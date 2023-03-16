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
      {props.login_state && <Navigation />}
      <Switch>
        {props.login_state ? (
          <>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route exact path='/profile'>
              <Profile />
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
