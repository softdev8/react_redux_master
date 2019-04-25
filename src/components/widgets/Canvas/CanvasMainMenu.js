import styles from './CanvasMainMenu.module.scss';

import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';

import Button from '../../common/Button';
import { FormControl } from 'react-bootstrap';
import {Btn, SomethingWithIcon, Icons} from '../../index';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

export default class CanvasMainMenu extends Component {

  static PropTypes = {
    currentFabricComponent    : PropTypes.object.isRequired,
    onComponentHeightChange   : PropTypes.func.isRequired,
    onComponentWidthChange    : PropTypes.func.isRequired,
    onComponentXChange        : PropTypes.func.isRequired,
    onComponentYChange        : PropTypes.func.isRequired,
    onComponentAngleChange    : PropTypes.func.isRequired,
    onComponentScaleChange    : PropTypes.func.isRequired,
    centerComponent           : PropTypes.func.isRequired,
    centerComponentHorizontal : PropTypes.func.isRequired,
    centerComponentVertical   : PropTypes.func.isRequired,
    duplicateComponent        : PropTypes.func.isRequired,
    onWidthChange             : PropTypes.func.isRequired,
    onHeightChange            : PropTypes.func.isRequired,
    bringToFront              : PropTypes.func.isRequired,
    sendToBack                : PropTypes.func.isRequired,
    editToggleComponent       : PropTypes.func.isRequired,
    removeComponent           : PropTypes.func.isRequired,
    switchGridLines           : PropTypes.func.isRequired,
    mode                      : PropTypes.string.isRequired,
    canvasHeight              : PropTypes.number.isRequired,
    canvasWidth               : PropTypes.number.isRequired,
  };

  constructor(props, context){
    super(props, context);

    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentDidMount() {
    this.setValues();
  }

  componentDidUpdate() {
    this.setValues();
  }

  createTooltipObject(tooltip_string) {
    return <Tooltip id={tooltip_string}>{ tooltip_string }</Tooltip>;
  }

  render() {

    const componentDimensionsEditArea = <div className={styles.row}>
      <div className={styles['row-title']}>Element</div>
        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set object width")}>
          <label className={`${styles.label} form-label`}>Width
            <FormControl name='componentWidth' ref={node => this.componentWidthRef = node} onKeyUp={this.handleKeyUp} onBlur={this.props.onComponentWidthChange}/>
          </label>
        </OverlayTrigger>

        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set object height")}>
          <label className={`${styles.label} form-label`}>Height
            <FormControl name='componentHeight' ref={node => this.componentHeightRef = node} onKeyUp={this.handleKeyUp} onBlur={this.props.onComponentHeightChange}/>
          </label>
        </OverlayTrigger>

        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set object's X coordinate")}>
          <label className={`${styles.label} form-label`}>X
            <FormControl name='componentX' ref={node => this.componentXRef = node} onKeyUp={this.handleKeyUp} onBlur={this.props.onComponentXChange}/>
          </label>
        </OverlayTrigger>

        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set object's Y coordinate")}>
          <label className={`${styles.label} form-label`}>Y
            <FormControl type='text' name='componentY' ref={node => this.componentYRef = node} onKeyUp={this.handleKeyUp} onBlur={this.props.onComponentYChange}/>
          </label>
        </OverlayTrigger>

        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set object's rotation angle")}>
          <label className={`${styles.label} form-label`}>Angle
            <FormControl type='text' name='componentAngle' ref={node => this.componentAngleRef = node} onKeyUp={this.handleKeyUp} onBlur={this.props.onComponentAngleChange}/>
          </label>
        </OverlayTrigger>

        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set object scale. Set 100% to reset")}>
          <label className={`${styles.label} form-label`}>Scale
            <FormControl type='text' name='componentScale' ref={node => this.componentScaleRef = node} onKeyUp={this.handleKeyUp} onBlur={this.props.onComponentScaleChange}/>
          </label>
        </OverlayTrigger>

        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Bring object to front")}>
          <Btn default onClick={this.props.bringToFront}>
            <SomethingWithIcon icon={Icons.arrowUpIcon}/>
          </Btn>
        </OverlayTrigger>

        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Send object to back")}>
          <Btn default onClick={this.props.sendToBack}>
            <SomethingWithIcon icon={Icons.arrowDownIcon}/>
          </Btn>
        </OverlayTrigger>

        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Center horizontal")}>
          <Btn default onClick={this.props.centerComponentHorizontal}>
            <SomethingWithIcon icon={Icons.horizontalAlignIcon}/>
          </Btn>
        </OverlayTrigger>

        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Center vertical")}>
          <Btn default onClick={this.props.centerComponentVertical}>
            <SomethingWithIcon icon={Icons.verticalAlignIcon}/>
          </Btn>
        </OverlayTrigger>

        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Center object")}>
          <Btn default onClick={this.props.centerComponent}>
            <SomethingWithIcon icon={Icons.bothAlignIcon}/>
          </Btn>
        </OverlayTrigger>

        <div className={styles['right-buttons']}>
          <OverlayTrigger placement='top' overlay={this.createTooltipObject("Duplicate object")}>
            <Btn default onClick={this.props.duplicateComponent}>
              <SomethingWithIcon icon={Icons.cloneIcon}/>
            </Btn>
          </OverlayTrigger>

          <OverlayTrigger placement='top' overlay={this.createTooltipObject("Delete object")}>
            <Btn default onClick={this.props.removeComponent}>
              <SomethingWithIcon icon={Icons.thinTrashIcon}/>
            </Btn>
          </OverlayTrigger>


          <OverlayTrigger placement='top' overlay={this.createTooltipObject("Edit object")}>
            <Btn default onClick={this.props.editToggleComponent}>
              <SomethingWithIcon icon={Icons.editIcon}/>
            </Btn>
          </OverlayTrigger>
        </div>
      </div>;

    return <div className={`${styles.menu} edcomp-toolbar`}>
            <div className={styles.row}>
              <div className={styles['row-title']}>Canvas</div>
              <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set canvas width")}>
                <label className={`${styles.label} form-label`}>Width
                  <FormControl ref={node => this.canvasWidthRef = node} onBlur={this.props.onWidthChange}/>
                </label>
              </OverlayTrigger>

              <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set Canvas height")}>
                <label className={`${styles.label} form-label`}>Height
                  <FormControl ref={node => this.canvasHeightRef = node} onBlur={this.props.onHeightChange}/>
                </label>
              </OverlayTrigger>

              <OverlayTrigger placement='top' overlay={this.createTooltipObject("Show/Hide grid")}>
                <Btn default onClick={this.props.switchGridLines}>
                  <SomethingWithIcon icon={Icons.tableIcon}/>
                </Btn>
              </OverlayTrigger>
            </div>
            {componentDimensionsEditArea}
          </div>;
  }

  handleKeyUp(e) {
    if (e.key == 'Enter') {
      if(e.target.name == 'componentWidth'){
        this.props.onComponentWidthChange(e);
      } else if(e.target.name == 'componentHeight'){
        this.props.onComponentHeightChange(e);
      }  else if(e.target.name == 'componentX'){
        this.props.onComponentXChange(e);
      }  else if(e.target.name == 'componentY'){
        this.props.onComponentYChange(e);
      } else if(e.target.name == 'componentAngle'){
        this.props.onComponentAngleChange(e);
      } else if(e.target.name == 'componentScale'){
        this.props.onComponentScaleChange(e);
      }
    }
  }

  setValues() {
    if(this.props.mode == 'edit'){
      findDOMNode(this.canvasHeightRef).value = this.props.canvasHeight || '';
      findDOMNode(this.canvasWidthRef).value  = this.props.canvasWidth || '';

      //Setting Component Values
      const { currentFabricComponent } = this.props;
      let componentHeight=0;
      let componentWidth=0;
      let componentY=0;
      let componentX=0;
      let componentAngle=0;
      let componentScale=0;

      if(currentFabricComponent){
        componentHeight = (currentFabricComponent.height * currentFabricComponent.scaleY).toFixed(2);
        componentWidth = (currentFabricComponent.width * currentFabricComponent.scaleX).toFixed(2);
        componentX = parseInt(currentFabricComponent.left);
        componentY = parseInt(currentFabricComponent.top);
        componentAngle = currentFabricComponent.angle;
        componentScale = (currentFabricComponent.scaleX*100).toFixed(2) ;
        if(currentFabricComponent.scaleX != currentFabricComponent.scaleY){
          componentScale = 'NA';
        }
      }

      findDOMNode(this.componentWidthRef).value  = componentWidth;
      findDOMNode(this.componentHeightRef).value  = componentHeight;
      findDOMNode(this.componentXRef).value  = componentX;
      findDOMNode(this.componentYRef).value  = componentY;
      findDOMNode(this.componentAngleRef).value  = componentAngle;
      findDOMNode(this.componentScaleRef).value  = componentScale;
    }
  }

}