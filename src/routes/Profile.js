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
    <div className='container'>
      <form onSubmit={onSubmit} className='profileForm'>
        <input
          type='text'
          placeholder='display name'
          value={newDisplayName}
          onChange={onChange}
          autoFocus
          className='formInput'
        />
        <input
          type='submit'
          value='Update Profile'
          className='formBtn'
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className='formBtn cancelBtn logOut' onClick={onLogOut}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
