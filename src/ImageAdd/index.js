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

  componentDidUpdate = (prevSate) => {
    if (this.props.initAddImage && prevSate.initAddImage !== this.props.initAddImage) {
      this.onClick();
      this.props.close();
    }
  }

  onClick() {
    this.input.value = null;
    this.input.click();
  }
  
  render() {
    return (
      <div className={styles.addVideo}>
          <input
            type="file"
            accept="image/*"
            ref={(c) => { this.input = c; }}
            onChange={this.changeUrl}
            style={{ display: 'none' }}
          />
      </div>
    );
  }
}
