import styles from './CollectionCategoryTitleEditor.module.scss';

import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import {FormControl, Button} from 'react-bootstrap';

export default class CollectionCategoryTitleEditor extends Component {

  static PropTypes = {
    saveTitle : PropTypes.func.isRequired,
    title     : PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);

    this.state = {
      title : props.title,
    }
  }

  componentDidMount() {
    const input = findDOMNode(this.inputRef);

    input.focus();
  }

  onSubmitHandler(e) {
    e.preventDefault();

    this.props.saveTitle(this.state.title);
  }

  onChangeHandler(e) {
    this.setState({
      title : e.target.value.trim(),
    });
  }

  render() {

    return  <form onSubmit={this.onSubmitHandler} className={styles['title-form']}>
              <FormControl placeholder='Type name of category' name='cat_name'
                     ref={(node) => this.inputRef = node}
                     defaultValue={this.state.title}
                     onChange={this.onChangeHandler}
                     onBlur={this.onSubmitHandler}/>
              <Button type='submit'/>
            </form>;
  }
}