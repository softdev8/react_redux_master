import styles from './MarkdownPasteModal.module.scss';
import { addComponent } from '../../../actions/components';
import { closeModal } from '../../../actions/modals';

import { MarkdownEditor, Code } from '../../widgets/index';
import { CodeMirrorModes, defaultLanguage } from '../../helpers/codeoptions';


import React from 'react';

import markdownToHtml from '../../../utils/markdownToHtml';
import Markdown from 'markdown-it';

import { connect } from 'react-redux';
import { ModalHeader } from '../index';
import { Btn } from '../../index';
import Immutable from 'immutable';


@connect()
class MarkdownPaste extends React.Component {
  constructor() {
    super();

    this.state = {
      text: ''
    };
  }

  onTextChange(e) {
    this.setState({ text: e.target.value });
  }

  getMarkdownBlocks(mdText) {
    try {
      const markdown = new Markdown().use((md) => {
        md.renderer.render = (tokens) => {
          md.markdownBlocks = tokens.filter((token) => {
            return token.map && token.map.length;
          });
        };
      });
      markdown.render(mdText);
      return markdown.markdownBlocks.map((token) => {
        return {
          type: token.tag,
          startLine: token.map[0],
          endLine: token.map[1],
          content: token.content,
          info: token.info
        };
      });
    } catch (err) {
      console.error(err);
      return '';
    }
  }


  addTextBlock(textBlock, mode, index) {
    const { dispatch } = this.props;

    const content = MarkdownEditor.getComponentDefault();
    content.text = textBlock;
    content.mdHtml = markdownToHtml(textBlock);

    dispatch(addComponent({
      data: {
        type: 'MarkdownEditor',
        mode,
        content: Immutable.fromJS(content)
      },
      parentHash: '0',
      index
    }));
  }

  addCodeBlock(codeBlock, info, mode, index) {
    const { dispatch } = this.props;

    const language = (info && info in CodeMirrorModes) ?
      info : defaultLanguage;

    const content = Code.getComponentDefault();
    content.content = codeBlock;
    content.language = language;

    dispatch(addComponent({
      data: {
        type: 'Code',
        mode,
        content: Immutable.fromJS(content)
      },
      parentHash:'0',
      index
    }));
  }


  pasteMarkdown() {
    const { params, dispatch } = this.props;

    const self = this;
    let componentIndex = params.index;
    const text = this.state.text;

    const lines = text.split('\n');
    const codeBlocks = this.getMarkdownBlocks(text);

    let mode = 'edit';
    let startIndex = 0;
    let textBlock = [];

    function getMode() {
      const returnMode = mode;
      if (mode === 'edit') {
        mode = 'view';
      }
      return returnMode;
    }

    function clearTextBlock() {
      if (textBlock.length) {
        self.addTextBlock(textBlock.join('\n'), getMode(), componentIndex++);
        textBlock = [];
      }
    }

    codeBlocks.forEach((block) => {
      switch (block.type) {

        case 'code':
          clearTextBlock(); // should be called before each block

          const content = (block.content.length && (
            block.content.slice(-1) === '\n' || block.content.slice(-1) === '\r'
          )) ? block.content.slice(0, -1) : block.content;
          self.addCodeBlock(content, block.info, getMode(), componentIndex++);
          break;

        default:
          if (startIndex <= block.startLine) {
            for (let i = 0; i < block.startLine - startIndex; i++) {
              textBlock.push('');
            }

            textBlock = textBlock.concat(lines.slice(block.startLine, block.endLine));
          }
      }
      if (block.endLine > startIndex) {
        startIndex = block.endLine;
      }

    });
    textBlock = textBlock.concat(lines.slice(startIndex));

    clearTextBlock();
    dispatch(closeModal());
  }


  render() {
    return (
      <div>
        <ModalHeader>
          <h3>Paste the markdown text:</h3>
        </ModalHeader>
        { this.props.closeIcon }
        <textarea className={styles.markdownTextarea} onChange={this.onTextChange.bind(this)} />
        <Btn className={styles.markdownPaste} secondary onClick={this.pasteMarkdown.bind(this)}>OK</Btn>
      </div>
    );
  }
}

module.exports = MarkdownPaste;
