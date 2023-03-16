import React, { useState, useEffect } from 'react';
import AppRouter from './Router';
import { authService } from '../fbase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  const auth = getAuth();
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // console.log(user);
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? <AppRouter login_state={isLoggedIn} /> : 'initializating...'}
      <footer>&copy; hwitter {new Date().getFullYear()} </footer>
    </>
  );
}

export default App;
