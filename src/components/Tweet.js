import React, { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { dbService } from '../fbase';
import { async } from '@firebase/util';

const Tweet = (props) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(props.tweetObj.text);
  const onDeleteTweet = async () => {
    const ok = window.confirm('are you sure delete this tweet?');
    if (ok) {
      //delete tweet
      await deleteDoc(doc(dbService, 'tweets', `${props.tweetObj.id}`));
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
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  return (
    <div>
      {editing ? (
        <>
          <form>
            <input
              type='text'
              placeholder='edit your tweet'
              value={newTweet}
              required
              onChange={onChange}
            />
            <button onClick={onSubmit}>update tweet</button>
          </form>
          <button onClick={toggleEditing}>cancel</button>
        </>
      ) : (
        <>
          <h4>{props.tweetObj.text}</h4>
          {props.isOwner && (
            <>
              <button onClick={onDeleteTweet}>Delete tweet</button>
              <button onClick={toggleEditing}>Edit tweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
