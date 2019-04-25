import styles from './ComponentPanel.module.scss';

import React, {Component} from 'react'
import {findDOMNode} from 'react-dom';
import PureComponent from 'react-pure-render/component';
import { DragSource, DropTarget } from 'react-dnd';
import {Button, Popover, Overlay} from 'react-bootstrap';
import pure from 'react-pure-component';

import Icon from '../../common/Icon';
import ModalManager from '../../common/ModalManager';
import PanelContainer from '../../common/PanelContainer';
import AddWidget from '../AddWidgetButton/AddWidgetButton';
import WidgetsList from '../WidgetsPanel/WidgetsPanel';
import ComponentControls from '../ComponentControls/ComponentControls';
import {Btn, SomethingWithIcon, Icons} from '../../index';

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const cardTarget = {
  hover(props, monitor, component) {

    const ownId = props.id;
    const draggedId = monitor.getItem().id;
    if (draggedId === ownId) {
      return;
    }

    const ownIndex = props.index;
    const draggedIndex = monitor.getItem().index;

    // What is my rectangle on screen?
    const boundingRect = findDOMNode(component).getBoundingClientRect();
    // Where is the mouse right now?
    const clientOffset = monitor.getClientOffset();
    // Where is my vertical middle?
    const ownMiddleY = (boundingRect.bottom - boundingRect.top) / 2;
    // How many pixels to the top?
    const offsetY = clientOffset.y - boundingRect.top;

    // We only want to move when the mouse has crossed half of the item's height.
    // If we're dragging down, we want to move only if we're below 50%.
    // If we're dragging up, we want to move only if we're above 50%.

    // Moving down: exit if we're in upper half
    if (draggedIndex < ownIndex && offsetY < ownMiddleY) {
      return;
    }

    // Moving up: exit if we're in lower half
    if (draggedIndex > ownIndex && offsetY > ownMiddleY) {
      return;
    }

    // Time to actually perform the action!
    props.moveComponent({id:draggedId, afterId:ownId});
  },
};


@DropTarget('COMP', cardTarget, (connect, monitor) => ({
  connectDropTarget : connect.dropTarget(),
  isOver            : monitor.isOver(),
  canDrop           : monitor.canDrop()
}))
@DragSource('COMP', cardSource, (connect, monitor) => ({
  connectDragSource  : connect.dragSource(),
  connectDragPreview : connect.dragPreview(),
  isDragging         : monitor.isDragging()
}))
export default class ComponentPanelContainer extends PureComponent {
  propTypes: {
    connectDragSource  : PropTypes.func.isRequired,
    connectDropTarget  : PropTypes.func.isRequired,
    connectDragPreview : PropTypes.func.isRequired,
    isDragging         : PropTypes.bool.isRequired,
    id                 : PropTypes.any.isRequired,
    hash               : PropTypes.any.isRequired,
    moveComponent      : PropTypes.func.isRequired,
    default_themes     : PropTypes.object.isRequired,
    title              : PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this.duplicateComponent = this.duplicateComponent.bind(this);

    this.state = {
      removed   : false,
      showPanel : false,
    };
  }

  duplicateComponent(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.duplicateComponent({parentHash:'0', data:null, index:this.props.index});
  }

  render() {
    const {
      isDragging,
      connectDragSource,
      connectDropTarget,
      connectDragPreview,
      isOver,
      canDrop,
      mode,
      customControls,
      editToggleComponent,
      removeComponent,
      selectActive,
      unSelectAll,
      addComponent,
      id,
      default_themes,
      hash,
      children,
      isSelected,
      index,
      title,
      popoverContent
    } = this.props;
    const opacity = isDragging ? 0 : 1;
    const {removed} = this.state;

    if (removed) {
      return null;
    }

    let noControls = false;
    if(!isSelected){
      noControls = true;
    }

    let controls = null;

    const controlsMethods = {
      connectDragSource,
      duplicateComponent  : this.duplicateComponent,
      editToggleComponent : () => editToggleComponent(hash),
      removeComponent     : () => removeComponent(hash),
    };

    const moveBtn = connectDragSource(<div style={{ display:'inline-block', marginLeft: 8 }}><Btn><SomethingWithIcon icon={Icons.moveIcon}/></Btn></div>);

    controls = <ComponentControls customControls={customControls}
                                  moveBtn={moveBtn}
                                  noControls={noControls}
                                  show={isSelected}
                                  mode={mode}
                                  default_themes={default_themes}
                                  className={styles.controls}
                                  {...controlsMethods}/>

    const {showPanel} = this.state;
    let componentClassName = styles.component;


    if(isSelected) componentClassName += ` ${styles.active}`;
    else if(mode == 'view') componentClassName += ` ${styles.preview}`;

    return connectDropTarget(connectDragPreview(
      <div onClick={()=>{ if(mode === 'view') {selectActive(hash);} }}
           className={componentClassName}>

        {controls}

        <div className={styles.content}>
          {children}
        </div>

        <div className={styles['add-widget-wrapper']}>
          <AddWidget showButton={true} index={index}
                     addComponent={addComponent} panelPosition='right' default_themes={default_themes}/>
        </div>

        { !isSelected ? <div className={styles['widget-name']}>{title}</div> : null }
        { isSelected &&
          <Overlay
            show={!!popoverContent}
            target={this}
            placement="top"
            container={this}
          >
            <Popover id='widget-popover' style={{fontSize: '14px', marginLeft: '35%', marginTop: '15px'}}>{popoverContent}</Popover>
          </Overlay>
        }
      </div>
    ));
  }
}
