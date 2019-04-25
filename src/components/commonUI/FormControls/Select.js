require('./Select.scss');

import React, {Component, PropTypes} from 'react';

export default class Select extends Component {

  static PropTypes = {
    options       : PropTypes.array.isRequired,
    value         : PropTypes.string,
    changeHandler : PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.displayName = '';

    this.defaultChangeHandler = this.defaultChangeHandler.bind(this);

    this.state = {
      value : null,
    }
  }

  componentWillMount() {
    this.setState({
      value : this.props.value,
    });
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      value: nextProps.value,
    });
  }

  defaultChangeHandler(e) {

    this.setState({
      value : e.target.value,
    })

    if(this.props.hasOwnProperty('changeHandler')) this.props.changeHandler(e);
  }

  getValue() {
    return this.state.value;
  }

  render() {
    const {changeHandler, options = ['value'], ...newProps} = this.props;

    const { value } = this.state;

    const opts = options.map( (option, i) => {
      const text = option.title || option;
      const val  = option.value || text;

      return <option value={val} key={i}>{ text }</option>;
    });

    newProps.value = value;

    return  <div className='b-select'>
              <select onChange={this.defaultChangeHandler} {...newProps}>
                { opts }
              </select>
            </div>;
  }
}