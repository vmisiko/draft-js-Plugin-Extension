import React, { Component } from "react";
import styles from "./styles.css";

export default class VideoAdd extends Component {
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
    console.log(this.state.open);
  };

  closePopover = () => {
    if (!this.preventNextClose && this.state.open) {
      this.setState({
        open: false
      });
    }

    this.preventNextClose = false;
  };

  addVideo = () => {
    const { editorState, onChange } = this.props;
    onChange(this.props.modifier(editorState, { src: this.state.url }));
  };

  changeUrl = (evt) => {
    this.setState({ url: evt.target.value });
  };

  render() {
    const popoverClassName = this.state.open
      ? styles.addVideoPopover
      : styles.addVideoClosedPopover;

    console.log(styles.addVideoPopover);

    return (
      <div className={styles.addVideo}>
        <button
          className="rounded"
          onMouseUp={this.openPopover}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </button>
        {this.state.open 
         ?<div className={popoverClassName} onClick={this.onPopoverClick}>
          <input
            type="text"
            placeholder="Paste the video url …"
            className={styles.addVideoInput}
            onChange={this.changeUrl}
            value={this.state.url}
          />
          <button
            className={styles.addVideoConfirmButton}
            type="button"
            onClick={this.addVideo}
          >
            Add
          </button>
          </div> 
          : ""
        }
      </div>
    );
  }
}
