import React, { useState, useEffect } from 'react';
import { dbService } from '../fbase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  onSnapshot,
} from 'firebase/firestore';
import Tweet from '../components/Tweet';
import TweetFactory from '../components/TweetFactory';

const Home = (props) => {
  const [tweets, setTweets] = useState([]);

  //   비실시간으로 데이터 가져오기
  //   const getTweets = async () => {
  //     const querySnapshot = await getDocs(collection(dbService, 'tweets'));
  //     querySnapshot.forEach((doc) => {
  //       const newTweetObject = {
  //         ...doc.data(),
  //         id: doc.id,
  //       };
  //       setTweets((prev) => [newTweetObject, ...prev]);
  //     });
  //   };

  useEffect(() => {
    // getTweets();  비실시간으로 데이터 가져오기
    const q = query(collection(dbService, 'tweets'));
    onSnapshot(q, (querySnapshot) => {
      const tweetArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArray);
    });
  }, []);

  return (
    <div className='container'>
      <TweetFactory userObj={props.userObj} />

      <div style={{ marginTop: 30 }}>
        {tweets.map((e) => (
          <Tweet
            tweetObj={e}
            key={e.id}
            isOwner={props.userObj.uid === e.creatorId}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
