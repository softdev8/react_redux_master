import React from 'react'
import {render} from 'react-dom';

class Ploader extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      display: 'none',
    };
  }

  hide(cb) {
    this.setState({display: 'none'}, cb);
  }

  show(cb) {
    this.setState({display: 'block'}, cb);
  }

  render() {
    return (
      <div className='preloader' style={{display: this.state.display}}>
        <img src={'/imgs/preloader.gif'} width='128' height='128'/>
      </div>
    );
  }
}

window.Preloader = render(<Ploader />, document.getElementById('app-preloader'));
