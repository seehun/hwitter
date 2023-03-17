import React from 'react';

const Tweet = (props) => {
  return (
    <div>
      <h4>{props.tweetObj.text}</h4>
      {props.isOwner && (
        <>
          <button>Delete tweet</button>
          <button>Edit tweet</button>
        </>
      )}
    </div>
  );
};

export default Tweet;
