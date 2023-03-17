import React, { useState, useEffect } from 'react';
import { dbService } from '../fbase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  onSnapshot,
  doc,
} from 'firebase/firestore';
import Tweet from '../components/Tweet';

const Home = (props) => {
  const [tweet, setTweet] = useState('');
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
      //   console.log(tweetArray);
      setTweets(tweetArray);
    });
  }, []);

  //   console.log(tweets);

  const onChange = (e) => {
    setTweet(e.currentTarget.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(dbService, 'tweets'), {
      text: tweet,
      createdAt: Date.now(),
      creatorId: props.userObj.uid,
    });
    setTweet('');
  };

  return (
    <div>
      <form>
        <input
          type='text'
          placeholder="what's on your mind?"
          maxLength={120}
          value={tweet}
          onChange={onChange}
        />
        <button onClick={onSubmit}>Tweet</button>
      </form>
      <div>
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
