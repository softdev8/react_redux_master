import React from 'react'
import $ from 'jquery'

export default (Component)=>{
  class WrappedAuthClassComponent extends React.Component {
    componentWillMount() {
      $('html').addClass('authentication');
    }

    componentWillUnmount() {
      $('html').removeClass('authentication');
    }

    render() {
      return (
        <Component {...this.props}/>
      );
    }
  }

  return WrappedAuthClassComponent;
}
