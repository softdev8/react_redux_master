import styles from './StringEditor.module.scss';

import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';

import {FormControl, Button} from 'react-bootstrap';

export default class StringEditor extends Component {

  static PropTypes = {
    saveString  : PropTypes.func.isRequired,
    string      : PropTypes.string,
    placeholder : PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);

    this.state = {
      string : props.string,
    }
  }

  componentDidMount() {
    const input = findDOMNode(this.inputRef);

    input.focus();
  }

  onSubmitHandler(e) {
    e.preventDefault();

    this.props.saveString(this.state.string);
  }

  onChangeHandler(e) {
    this.setState({
      string : e.target.value.trim(),
    });
  }

  render() {

    const {placeholder = 'Type name of category', string} = this.props;

    return  <form onSubmit={this.onSubmitHandler} className={styles.form}>
              <FormControl placeholder={placeholder} name='string'
                     ref={node => this.inputRef = node}
                     defaultValue={string}
                     onChange={this.onChangeHandler}
                     onBlur={this.onSubmitHandler}/>
              <Button className={styles.button} type='submit'/>
            </form>;
  }
}