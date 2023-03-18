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
import { storageService } from '../fbase';
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const Home = (props) => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const [attachment, setAttachment] = useState();

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

  const onChange = (e) => {
    setTweet(e.currentTarget.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentURL = '';

    if (attachment !== '') {
      const attachmentRef = ref(
        storageService,
        `${props.userObj.uid}/${uuidv4()}`
      );
      const response = await uploadString(
        attachmentRef,
        attachment,
        'data_url'
      );
      attachmentURL = await getDownloadURL(attachmentRef);
    }

    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: props.userObj.uid,
      attachmentURL: attachmentURL,
    };
    await addDoc(collection(dbService, 'tweets'), tweetObj);
    setTweet('');
    setAttachment('');
  };
  const onFileChange = (e) => {
    const theFile = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = (finishEvent) => {
      setAttachment(finishEvent.currentTarget.result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment(null);

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

        <input type='file' accept='image/*' onChange={onFileChange} />
        {attachment && (
          <div>
            <img src={attachment} alt='img' width='50px' height='50px' />
            <button onClick={onClearAttachment}>clear</button>
          </div>
        )}
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
