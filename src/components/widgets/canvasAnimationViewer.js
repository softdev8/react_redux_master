import React, {Component} from 'react'
import PureComponent from 'react-pure-render/component'

import Canvas from "./Canvas/canvas";

const Button = require('../common/Button');
import DumbModal from '../common/dumbModal';
import {SomethingWithIcon, Icons} from '../index';

import {Modal, ModalBody} from '../common/Modal';
const ModalManager = require('../common/ModalManager');

class CanvasAnimationViewer extends Component{
	constructor(props, context){
		super(props, context);

		this.moveLeft = this.moveLeft.bind(this);
		this.moveRight = this.moveRight.bind(this);
		this.reset = this.reset.bind(this);
		this.play = this.play.bind(this);
		this.moveRightTimed = this.moveRightTimed.bind(this);
		this.stop = this.stop.bind(this);
		this.switchExpandedView = this.switchExpandedView.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.showCanvasAnimationInModal = this.showCanvasAnimationInModal.bind(this);
		this.renderAnimatedCanvas = this.renderAnimatedCanvas.bind(this);
		this.renderExpandedCanvas = this.renderExpandedCanvas.bind(this);

    let keygen = 0;
    const keys = [];
    this.props.content.canvasObjects.map(function (obj, i) {
      keys[i] = keygen++;
    });

    this.state = {
      keys,
      selectedCanvas: 0,
      width: this.props.content.width,
      height: this.props.content.height,
      timer: null,
      expandedView: false,
      play: false,
    };
	}

  moveLeft (e) {
    if(e){
      e.stopPropagation();
    }
    this.stop();

    if (this.state.selectedCanvas > 0) {
      const updatedSelectedIndex = this.state.selectedCanvas - 1;
      this.setState({
        selectedCanvas: updatedSelectedIndex,
      });
    }
  }

  moveRight (e) {
    if(e){
      e.stopPropagation();
    }
    this.stop();

    if (this.state.selectedCanvas < this.props.content.canvasObjects.length - 1) {
      const updatedSelectedIndex = this.state.selectedCanvas + 1;
      this.setState({
        selectedCanvas: updatedSelectedIndex,
      });
    }
  }

  reset (e) {
    if(e){
      e.stopPropagation();
    }

    this.stop();

    if (this.props.content.canvasObjects.length > 0) {
      this.setState({
        selectedCanvas: 0,
      });
    }
  }

  play (e) {
    e.stopPropagation();

    this.setState({play: true});
    this.state.timer = setInterval(this.moveRightTimed, 1000);
  }

  moveRightTimed (e) {
    if(e){
      e.stopPropagation();
    }

    clearInterval(this.state.timer);

    //show next canvas
    if (this.state.selectedCanvas < this.props.content.canvasObjects.length - 1) {
      const updatedSelectedIndex = this.state.selectedCanvas + 1;
      this.setState({
        selectedCanvas: updatedSelectedIndex,
      });
    }

    if (this.state.selectedCanvas < this.props.content.canvasObjects.length - 1) {
      this.state.timer = setInterval(this.moveRightTimed, 1000);
    } else {
      this.setState({play: false});
    }
  }

  stop(e){
    if(e){
      e.stopPropagation();
    }

    clearInterval(this.state.timer);

    if(this.state.play == true){
      this.setState({play: false});
    }
  }

  switchExpandedView(e){
    if(e){
      e.stopPropagation();
    }

    clearInterval(this.state.timer);

    if(this.state.play == false){
      this.setState({
        expandedView: !this.state.expandedView,
      });
    } else {
      this.setState({
        expandedView: !this.state.expandedView,
        play: false,
      });
    }
  }

  closeModal () {
    this.stop();
    ModalManager.remove();
  }

  showCanvasAnimationInModal (e) {
    if(e){
      e.stopPropagation();
    }

    this.stop();
    const config = {displayFullScreen: true};

    const modalContent = <CanvasAnimationViewer content={this.props.content} config={config} pageProperties={this.props.pageProperties}/>;

    class MyModal extends PureComponent {
        constructor(){
          super()
          this.open = this.open.bind(this);
        }
        open(){
          this.refs.modalDg.refs.modal.open();
        }
        render(){
          return <DumbModal ref='modalDg' children={modalContent} />;
        }
      }

    ModalManager.create(MyModal);
  }

  renderAnimatedCanvas(compAlign, canvasContent, key, config, canvasCount, selectedCanvasIndex) {
      let canvas = null;
      if (canvasContent != null && canvasCount != 0) {
        const canvasViewKey = `canvasView${key}`;
        canvas = <div key={canvasViewKey} className='canvas-animation-view-div'>
          <Canvas key={key} mode='view' content={canvasContent}
                  pageProperties={this.props.pageProperties} config={config} onWidthChange={this.changeWidth}
                  onHeightChange={this.changeHeight}/>
          { canvasCount > 1 ? <div style={{fontSize:"11px", textAlign:"right", marginRight:10}}>{selectedCanvasIndex+1} of {canvasCount}</div> : null }
        </div>;
      } else {
        canvas = <p className='text-center fg-darkgray50'><br/><br/>No Canvas Added<br/><br/></p>;
      }

      return (
        <div style={{textAlign:compAlign}}>
          <div style={{display:'block'}}>
            {canvas}
          </div>
          { canvasCount > 1 ?
          <div style={{textAlign:compAlign}}>
            <div style={{margin:'0 auto'}}>
              { this.state.play ?
              <Button lg className='educative-button-transparent'
                      onClick={this.stop}>
                <SomethingWithIcon icon={Icons.pauseIcon}/>
              </Button> :
              <Button lg className='educative-button-transparent'
                      onClick={this.play}>
                <SomethingWithIcon icon={Icons.playIcon}/>
              </Button>}
              <Button lg className='educative-button-transparent'
                      disabled={this.state.selectedCanvas == 0 ? true: false} onClick={this.moveLeft}>
                <SomethingWithIcon icon={Icons.chevronLeftIcon}/>
              </Button>
              <Button lg className='educative-button-transparent'
                      disabled={this.state.selectedCanvas == canvasCount - 1 ? true: false} onClick={this.moveRight}>
                <SomethingWithIcon icon={Icons.chevronRightIcon}/>
              </Button>
              <Button lg className='educative-button-transparent' onClick={this.reset}>
                <SomethingWithIcon icon={Icons.repeatIcon}/>
              </Button>
              <Button lg className='educative-button-transparent' onClick={this.switchExpandedView}>
                <SomethingWithIcon icon={Icons.thinPlus1}/>
              </Button>

              {this.props.config && this.props.config.displayFullScreen?
              <Button lg className='educative-button-transparent' onClick={this.closeModal}>
                <SomethingWithIcon icon={Icons.compressIcon}/>
              </Button>:
              <Button lg className='educative-button-transparent' onClick={this.showCanvasAnimationInModal}>
                <SomethingWithIcon icon={Icons.expandIcon}/>
              </Button>}

            </div>
          </div> : null }
        </div>
      );
  }

  renderExpandedCanvas(compAlign, canvasObjects, key, config, canvasCount) {
      var canvasObjects = this.props.content.canvasObjects.map((canvas, i) => {
        const key = this.state.keys[i];
        const canvasViewKey = `canvasView${key}`;
        return <div key={canvasViewKey} className='canvas-animation-view-div'>
          <Canvas key={key} mode='view' content={canvas}
                  pageProperties={this.props.pageProperties} config={config} onWidthChange={this.changeWidth}
                  onHeightChange={this.changeHeight}/>
          <div style={{fontSize:"11px"}}>{i+1} of {this.props.content.canvasObjects.length}</div>
        </div>;
      });

      if (canvasObjects == null) {
        canvasObjects = <p className='text-center fg-darkgray50'><br/><br/>No Canvas Added<br/><br/></p>;
      }

      return (
        <div style={{textAlign:compAlign}}>
          <div style={{display:'block'}}>
            {canvasObjects}
          </div>
          <div style={{textAlign:compAlign}}>
            <div style={{margin:'0 auto'}}>
              <Button lg className='educative-button-transparent' onClick={this.switchExpandedView}>
                <SomethingWithIcon icon={Icons.minusIcon}/>
              </Button>

              {this.props.config && this.props.config.displayFullScreen?
              <Button lg className='educative-button-transparent' onClick={this.closeModal}>
                <SomethingWithIcon icon={Icons.compressIcon}/>
              </Button>:
              <Button lg className='educative-button-transparent' onClick={this.showCanvasAnimationInModal}>
                <SomethingWithIcon icon={Icons.expandIcon}/>
              </Button>}
            </div>
          </div>
        </div>
      );
  }

  render() {
    let compAlign = 'center';
    if (this.props.pageProperties && this.props.pageProperties.pageAlign) {
      compAlign = this.props.pageProperties.pageAlign;
    }
    const canvasContent = this.props.content.canvasObjects[this.state.selectedCanvas];
    const key = this.state.keys[this.state.selectedCanvas];
    const config = {canvasInAnimation: true};
    const canvasCount = this.props.content.canvasObjects != null ? this.props.content.canvasObjects.length : 0;
  	let viewOnlyRender = null;
    if(this.state.expandedView){
      viewOnlyRender = this.renderExpandedCanvas(compAlign, config, canvasCount);
    } else {

      viewOnlyRender = this.renderAnimatedCanvas(compAlign, canvasContent, key, config, canvasCount, this.state.selectedCanvas);
    }

    return <div>{viewOnlyRender}</div>;
  }
}

module.exports = CanvasAnimationViewer;
