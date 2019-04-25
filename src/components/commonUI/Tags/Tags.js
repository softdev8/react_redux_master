import styles from './Tag.module.scss';

import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import update from 'react/lib/update';

import Tag from './Tag';

export default class Tags extends Component {

  static PropTypes = {
    // array or string
    tags     : PropTypes.any.isRequired,

    onChange : PropTypes.func,
    mode     : PropTypes.string,
    maxTags  : PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.onKeyUp         = this.onKeyUp.bind(this);
    this.handleFocusBlur = this.handleFocusBlur.bind(this);
    this.onTagsClick     = this.onTagsClick.bind(this);
    this.removeTag       = this.removeTag.bind(this);

    this.state = {
      tags     : buildTags(props.tags),
      hasValue : false,
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.tags !== this.props.tags) {
      this.setState({
        tags : buildTags(nextProps.tags),
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {

    if(nextState.hasValue && (nextState.hasValue == this.state.hasValue)) return false;

    return true;
  }

  getTags() {
    return this.state.tags.toString();
  }

  render() {    
    let className = this.state.tags.length ? styles.tags : `${styles.tags} ${styles.empty}`;

    className += this.props.className ? ` ${this.props.className}` : '';

    const tags = this.state.tags.map( (tag, i) => {
      return <li key={i}>
              <Tag data={tag} key={i} removeTag={this.removeTag}/>
             </li>;
    })

    return  <div className={className} onClick={this.onTagsClick}>
              <ul className={styles.list}>{ tags }</ul>
              <input type='hidden' name='tags' value={this.state.tags.join()}/>
              { this.props.mode == 'write' ? <input type='text' ref='input'
                                                    placeholder='Type tags here. Press ENTER or , to add new tag'
                                                    className={`form-control ${styles.input}`} 
                                                    onFocus={this.handleFocusBlur}
                                                    onBlur={this.handleFocusBlur}
                                                    onKeyUp={this.onKeyUp}/>
                                           : null }
            </div>;
  }

  onTagsClick(e) {
    const inputNode = findDOMNode(this.refs.input);

    if(inputNode) inputNode.focus();
  }

  handleFocusBlur(e) {
    const value = e.target.value;

    // add tag if string isn't empty
    if(value) this.addTag(value, e);
  }

  onKeyUp(e) {
    const key    = e.keyCode;
    const value  = e.target.value.trim();
    const {tags, hasValue} = this.state;


    if(key == 8 && !value && hasValue) {
      this.setState({
        hasValue: false,
      });
      return;
    }

    // backspace pressed
    if(key == 8 && !hasValue) {
      this.removeTag(tags[tags.length - 1]);
      return
    }

    if(!value) return;

    // press esc or single comma
    if(key == 27 || value == ',') { 
      e.target.value = '';
      return;
    }

    //press enter or comma been typed
    if(key == 13 || key == 188) { 
      
      if(this.isSameTag(value)) {
        e.target.value = '';
        return;
      }

      this.addTag(value, e);

      return;
    }

    this.setState({
      hasValue: true,
    });
  }

  removeTag(value) {

    const indexToRemove = this.state.tags.indexOf(value);

    this.setState(update(this.state, {tags: {$splice: [[indexToRemove, 1]]}}), () => {
      this.props.hasOwnProperty('onChange') && typeof this.props.onChange == 'function' && this.props.onChange(this.state.tags);
    });

  }

  isSameTag(newTag) {
    return this.state.tags.indexOf(newTag) !== -1;
  }

  addTag(tag, e) {

    // remove comma from string
    tag = tag.replace(',', '');
    
    if(!this.checkTags(tag)) return;

    let newState = update(this.state, {tags: {$push: [tag]}});

    newState.hasValue = false;

    this.setState(newState, () => {
      this.props.hasOwnProperty('onChange') && typeof this.props.onChange == 'function' && this.props.onChange(this.state.tags);
    });

    e.target.value = '';
  }

  checkTags(tag) {

    // user able to add only 3 tags max
    let maxTags = this.props.maxTags != null ? this.props.maxTags : 3;
    if(this.state.tags.length >= maxTags) return false;

    // max length of tag should be no more than 24 chars and 3 minimum
    if(tag.length < 3 || tag.length > 24) return false;

    return true;
  }
}

function buildTags(tags) {

  if(!tags) return [];

  if(typeof tags == 'object' && tags.hasOwnProperty('length')) {
    return tags.filter( tag => {
      return !!tag;
    });
  }

  return tags.trim().split(',');

}