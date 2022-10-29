import React, { Component } from "react";
import styles from "../VideoAdd/styles.css";
import { AtomicBlockUtils, EditorState } from "draft-js";
import axios from "axios"

const http = axios.create({
  baseURL: "https://api.quantumgrad.com"
})

export default class ImageAdd extends Component {
  // Start the popover closed

  constructor(props) {
    super(props);

    this.state = {
      url: "",
      open: false
    };

    this.onClick = this.onClick.bind(this);
    this.changeUrl = this.changeUrl.bind(this);
  }

  addImage = (url) => {
    const { editorState, onChange } = this.props;    
    const newUrl = url.split(",");
    console.log(newUrl, 'newUrl');
    let newEditorState = editorState;

    newUrl.forEach((v) => {
      newEditorState = this.insertImage(newEditorState, v);
    });

    onChange(newEditorState);
  };

  insertImage = (editorState, url) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "image",
      "IMMUTABLE",
      { src: url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
  };

  changeUrl = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file.type.indexOf("image/") === 0) {
      // This is a post request to server endpoint with image as `image`
      const formData = new FormData();
      formData.append("fileobject", file);
      let config = {
        method: "post",
        url: "/api/file/upload?file_type=articles",
        data: formData,
      };
      http(config)
        .then((res) => {
          let data = res.data;
          console.log(data.image_url);
          if (data.image_url) {
            this.setState({url: data.image_url});
            this.addImage(data.image_url);
          }

        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  onClick() {
    this.input.value = null;
    this.input.click();
  }
  
  render() {
    return (
      <div className={styles.addVideo}>
        <button
        className="md-sb-button md-sb-img-button"
        type="button"
          onClick={this.onClick}
          title="Add an Image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <input
            type="file"
            accept="image/*"
            ref={(c) => { this.input = c; }}
            onChange={this.changeUrl}
            style={{ display: 'none' }}
          />
        </button>
      </div>
    );
  }
}
