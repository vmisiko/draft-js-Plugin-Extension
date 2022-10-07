import React, { Component } from "react";
import styles from "../VideoAdd/styles.css";
import { AtomicBlockUtils, EditorState } from "draft-js";

export default class ImageAdd extends Component {
  // Start the popover closed
  state = {
    url: "",
    open: false
  };

  // When the popover is open and users click anywhere on the page,
  // the popover should close
  componentDidMount() {
    document.addEventListener("click", this.closePopover);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.closePopover);
  }

  // Note: make sure whenever a click happens within the popover it is not closed
  onPopoverClick = () => {
    this.preventNextClose = true;
  };

  openPopover = () => {
    if (!this.state.open) {
      this.preventNextClose = true;
      this.setState({
        open: true
      });
    }
  };

  closePopover = () => {
    if (!this.preventNextClose && this.state.open) {
      this.setState({
        open: false
      });
    }

    this.preventNextClose = false;
  };

  addImage = () => {
    const { editorState, onChange } = this.props;
    const { url } = this.state;

    const newUrl = url.split(",");
    let newEditorState = editorState;

    newUrl.forEach((v) => {
      newEditorState = this.insertImage(newEditorState, v);
    });

    // const newEditorState = this.insertImage(editorState, url);

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

  changeUrl = (evt) => {
    this.setState({ url: evt.target.value });
  };

  render() {
    const popoverClassName = this.state.open
      ? styles.addVideoPopover
      : styles.addVideoClosedPopover;
    const buttonClassName = this.state.open
      ? styles.addVideoPressedButton
      : styles.addVideoButton;

    return (
      <div className={styles.addVideo}>
        <button
          className={buttonClassName}
          onMouseUp={this.openPopover}
          type="button"
        >
          +
        </button>
        <div className={popoverClassName} onClick={this.onPopoverClick}>
          <input
            type="text"
            placeholder="Paste the image url …"
            className={styles.addVideoInput}
            onChange={this.changeUrl}
            value={this.state.url}
          />
          <button
            className={styles.addVideoConfirmButton}
            type="button"
            onClick={this.addImage}
          >
            Add
          </button>
        </div>
      </div>
    );
  }
}
