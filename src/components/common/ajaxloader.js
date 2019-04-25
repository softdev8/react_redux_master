import React from 'react'

class AjaxLoader extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      text: props.content,
      display: props.visible ? 'display' : 'none',
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
      <div className='ajax-loader' style={{display: this.state.display}}>
        <img src='/imgs/ajax-loader.gif'/>
        <span style={{paddingLeft: 6}} dangerouslySetInnerHTML={{__html: this.state.text}}/>
      </div>
    );
  }
}

module.exports = AjaxLoader;