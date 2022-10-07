import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import createSideToolbarPlugin from '@draft-js-plugins/side-toolbar';
import editorStyles from './editor.css';
import '@draft-js-plugins/side-toolbar/lib/plugin.css';

import createVideoPlugin from '@draft-js-plugins/video';
import createImagePlugin from '@draft-js-plugins/image';
import ImageAdd from './ImageAdd';
import VideoAdd from './VideoAdd';


const videoPlugin = createVideoPlugin();
const imagePlugin = createImagePlugin();
const sideToolbarPlugin = createSideToolbarPlugin();

const { SideToolbar } = sideToolbarPlugin;

const plugins = [sideToolbarPlugin, videoPlugin, imagePlugin];
const text =
  'Once you click into the text field the sidebar plugin will show up …';

export default class SimpleSideToolbarEditor extends Component {
  state = {
    editorState: createEditorStateWithText(text),
  };

  componentDidMount() {
    // fixing issue with SSR https://github.com/facebook/draft-js/issues/2332#issuecomment-761573306
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      editorState: createEditorStateWithText(text),
    });
    this.focus();
  }

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    return (
      <div className={editorStyles.editor} onClick={this.focus}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={(element) => {
            this.editor = element;
          }}
        />
        <SideToolbar className="ml-5"/>
        <VideoAdd
          editorState={this.state.editorState}
          onChange={this.onChange}
          modifier={videoPlugin.addVideo}
        />
        <ImageAdd
          editorState={this.state.editorState}
          onChange={this.onChange}
          modifier={imagePlugin.addImage}
        />
      </div>
    );
  }
}