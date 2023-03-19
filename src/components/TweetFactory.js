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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const TweetFactory = (props) => {
  const [tweet, setTweet] = useState('');
  const [attachment, setAttachment] = useState('');
  const onChange = (e) => {
    setTweet(e.currentTarget.value);
  };

  const onSubmit = async (e) => {
    if (tweet === '') {
      return;
    }
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
  const onClearAttachment = () => setAttachment('');
  return (
    <form onSubmit={onSubmit} className='factoryForm'>
      <div className='factoryInput__container'>
        <input
          className='factoryInput__input'
          type='text'
          placeholder="what's on your mind?"
          maxLength={120}
          value={tweet}
          onChange={onChange}
        />
        <input type='submit' value='&rarr;' className='factoryInput__arrow' />
      </div>
      <label htmlFor='attach-file' className='factoryInput__label'>
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>

      <input
        type='file'
        accept='image/*'
        onChange={onFileChange}
        id='attach-file'
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className='factoryForm__attachment'>
          <img
            src={attachment}
            alt='img'
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className='factoryForm__clear' onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
      <button onClick={onSubmit}>Tweet</button>
    </form>
  );
};

export default TweetFactory;
