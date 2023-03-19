import React, { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { dbService } from '../fbase';
import { storageService } from '../fbase';
import { ref, deleteObject } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const Tweet = (props) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(props.tweetObj.text);
  const onDeleteTweet = async () => {
    const ok = window.confirm('are you sure delete this tweet?');
    if (ok) {
      //delete tweet
      await deleteDoc(doc(dbService, 'tweets', `${props.tweetObj.id}`));

      await deleteObject(
        ref(storageService, `${props.tweetObj.attachmentURL}`)
      );
    }
  };
  const onChange = (e) => {
    setNewTweet(e.currentTarget.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    // console.log(props.tweetObj, newTweet);
    await updateDoc(doc(dbService, 'tweets', `${props.tweetObj.id}`), {
      text: newTweet,
    });
    setEditing(false);
    console.log(props.tweetObj.attachmentURL);
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  return (
    <div className='nweet'>
      {editing ? (
        <>
          <form onSubmit={onSubmit} className='container nweetEdit'>
            <input
              type='text'
              placeholder='edit your tweet'
              value={newTweet}
              required
              onChange={onChange}
              autoFocus
              className='formInput'
            />
            {/* <button onClick={onSubmit}>update tweet</button> */}
            <input type='submit' value='Update Nweet' className='formBtn' />
          </form>
          <span onClick={toggleEditing} className='formBtn cancelBtn'>
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{props.tweetObj.text}</h4>
          {/* {props.tweetObj.attachmentURL && (
            <img
              src={props.tweetObj.attachmentURL}
              alt='tweet'
              width='50px'
              height='50px'
            />
          )} */}
          {props.tweetObj.attachmentURL && (
            <img src={props.tweetObj.attachmentURL} alt='tweet' />
          )}
          {props.isOwner && (
            <div className='nweet__actions'>
              <span onClick={onDeleteTweet}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
