import React from 'react'
import Dispatcher from '../components/common/Dispatcher'

let openState = (!Modernizr.touch) ? (localStorage.getItem('sidebar-open-state') === 'true' ? true : false) : false;

export default (Component)=>{
  class WrappedSidebarComponent extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.sidebarStateChangeCallback = this.sidebarStateChangeCallback.bind(this);

      this.state = {
        open: openState,
      };
    }

    componentWillMount() {
      Dispatcher.on('sidebar', this.sidebarStateChangeCallback);
    }

    componentWillUnmount() {
      Dispatcher.off('sidebar', this.sidebarStateChangeCallback);
    }

    sidebarStateChangeCallback(open) {
      if(this.state.open === open) return;
      if(open !== undefined){
        openState = open;
      } else {
        openState = !this.state.open;
      }

      this.setState({
        // toggle sidebar
        open: openState,
      });
      localStorage.setItem('sidebar-open-state', openState);
    }

    render() {
      return (
        <Component {...this.props}/>
      );
    }
  }

  return WrappedSidebarComponent;
}
