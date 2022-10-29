import React, { Component } from 'react';
import Editor, { createEditorStateWithText, composeDecorators } from '@draft-js-plugins/editor';
import createSideToolbarPlugin from '@draft-js-plugins/side-toolbar';
import '@draft-js-plugins/side-toolbar/lib/plugin.css';
import {
  // HeadlineOneButton,
  // HeadlineTwoButton,
  // BlockquoteButton,
  CodeButton,
  CodeBlockButton,
} from '@draft-js-plugins/buttons'
import createVideoPlugin from '@draft-js-plugins/video';
import createImagePlugin from '@draft-js-plugins/image'
import createAlignmentPlugin from '@draft-js-plugins/alignment';
import createFocusPlugin from '@draft-js-plugins/focus';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import ImageAdd from './ImageAdd';
import VideoAdd from './VideoAdd';
import VideoButton from './Buttons/components/VideoButton';
import ImageButton from './Buttons/components/ImageButton';

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
    showVideo: false,
    showImage: false,
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

  openVideoLink = () => {
    console.log('open');
    this.setState({
      showVideo: true,
    })
  }

  openImageLink = () => {
    console.log('open');
    this.setState({
      showImage: true,
    })
  }

  addVideo = (event) => {
    console.log(event);
    this.setState({showVideo: false});
    videoPlugin.addVideo(event);
  }
  
  close = () => {
    console.log('closing....')
    this.setState({
      showVideo: false,
      showImage: false
    });
  }

  render() {
    return (
      <div>
        <VideoAdd 
          className="my-5" 
          show={this.state.showVideo}
          editorState={this.state.editorState}
          onChange={this.onChange}
          modifier={videoPlugin.addVideo}
          close={this.close}
        />
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
              <div className='flex spacing-x-1 ml-2 py-1'>
                <ImageButton
                  {...externalProps} 
                  openImageLink={this.openImageLink}
                />
                <VideoButton  
                  {...externalProps} 
                  openVideoLink={this.openVideoLink}
                />
               
                <CodeButton className="-mt-5" {...externalProps} />

              </div>
            )
          }

          </SideToolbar> 
        </div>
        
        <ImageAdd
          initAddImage={this.state.showImage}
          editorState={this.state.editorState}
          onChange={this.onChange}
          modifier={imagePlugin.addImage}
          close={this.close}
        />
      </div>
    );
  }
}