import React, { useState } from 'react';
import { dbService } from '../fbase';
import { storageService } from '../fbase';
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

import {
  collection,
  addDoc,
  getDocs,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const TweetFactory = (props) => {
  const [tweet, setTweet] = useState('');
  const [attachment, setAttachment] = useState('');
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
  );
};

export default TweetFactory;
