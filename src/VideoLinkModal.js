import { useState } from 'react';
import styles from "./VideoAdd/styles.css";

const VideoLinkModal = (props) => {

  const [url, setUrl] =  useState('');
  const addVideo = (e) => {
    e.preventDefault();
    const { editorState, onChange, close } = props;
    onChange(props.modifier(editorState, { src: url }));
    close();
  };

  const changeUrl = (evt) => {
    setUrl(evt.target.value);
  };

  return (
    <div>
      { props.show ? 
      
      <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white z-50">
        <div className="mt-3">
          <input
            type="text"
            placeholder="Paste the video url …"
            className={styles.addVideoInput}
            onChange={changeUrl}
            value={url}
          />
          <button
            className="ml-5 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            type="button"
            onClick={addVideo}
          >
            Add
          </button>
        </div>
      </div> : ""
    }
    </div>
  );
}

export default VideoLinkModal;

