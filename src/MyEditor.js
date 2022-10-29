import React, { Component } from 'react';
import Editor, { createEditorStateWithText, composeDecorators } from '@draft-js-plugins/editor';
import createSideToolbarPlugin from '@draft-js-plugins/side-toolbar';
import '@draft-js-plugins/side-toolbar/lib/plugin.css';
import {
  HeadlineOneButton,
  HeadlineTwoButton,
  BlockquoteButton,
  CodeBlockButton,
} from '@draft-js-plugins/buttons'
import createVideoPlugin from '@draft-js-plugins/video';
import createImagePlugin from '@draft-js-plugins/image'
import createAlignmentPlugin from '@draft-js-plugins/alignment';
import createFocusPlugin from '@draft-js-plugins/focus';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import ImageAdd from './ImageAdd';
import VideoAdd from './VideoAdd';

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const alignmentPlugin = createAlignmentPlugin();

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator
);


const videoPlugin = createVideoPlugin({ decorator });

const imagePlugin = createImagePlugin();
const sideToolbarPlugin = createSideToolbarPlugin();

const { SideToolbar } = sideToolbarPlugin;

const plugins = [ sideToolbarPlugin, focusPlugin, alignmentPlugin, resizeablePlugin, videoPlugin, imagePlugin];
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
      <div>
        <div className="border-1 border-gray-400 h-30"onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={(element) => {
              this.editor = element;
            }}
          />
          <SideToolbar className="ml-5"> 
          {
            // may be use React.Fragment instead of div to improve perfomance after React 16
            (externalProps) => (
              <div>
                <HeadlineOneButton {...externalProps} />
                <HeadlineTwoButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                <CodeBlockButton {...externalProps} />
              </div>
            )
          }

          </SideToolbar>
          
        </div>
        <VideoAdd
          className="mt-10"
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