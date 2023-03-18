import React, { useEffect, useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { dbService } from '../fbase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const Profile = (props) => {
  const [newDisplayName, setNewDisplayName] = useState(
    props.userObj.displayName
  );

  const onLogOut = () => {
    const auth = getAuth();
    auth.signOut();
  };
  const getMyTweet = async () => {
    const q = query(
      collection(dbService, 'tweets'),
      where('creatorId', '==', props.userObj.uid),
      orderBy('createdAt')
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, ' => ', doc.data());
    });
  };

  useEffect(() => {
    getMyTweet();
  }, []);

  const onChange = (e) => {
    setNewDisplayName(e.currentTarget.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (props.userObj.displayName !== newDisplayName) {
      const auth = getAuth();
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName,
      });
      props.refreshUser();
    }
  };

  return (
    <>
      <form>
        <input
          type='text'
          placeholder='display name'
          value={newDisplayName}
          onChange={onChange}
        />
        <button onClick={onSubmit}>update profile</button>
      </form>
      <button onClick={onLogOut}>log out</button>
    </>
  );
};

export default Profile;
