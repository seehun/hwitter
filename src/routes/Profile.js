import React from 'react';
import { getAuth } from 'firebase/auth';

const Profile = () => {
  const onLogOut = () => {
    const auth = getAuth();
    auth.signOut();
  };
  return (
    <>
      <button onClick={onLogOut}>log out</button>
    </>
  );
};

export default Profile;
