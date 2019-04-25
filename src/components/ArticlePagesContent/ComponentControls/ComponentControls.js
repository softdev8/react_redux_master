import styles from './ComponentControls.module.scss';

import React, {Component, PropTypes} from 'react';
import { DragSource } from 'react-dnd';

import {Btn, SomethingWithIcon, Icons} from '../../index';

// const cardSource = {
//   beginDrag(props) {
//     return {
//       id: props.dragProps.id,
//       index: props.dragProps.index
//     };
//   }
// };

// @DragSource('COMP', cardSource, (connect, monitor) => ({
//   connectDragSource: connect.dragSource()
// }))
export default class ComponentControls extends Component {

  static PropTypes = {
    customControls : PropTypes.node,
    moveBtn        : PropTypes.node,
    noControls     : PropTypes.bool,
    show           : PropTypes.bool.isRequired,
    mode           : PropTypes.string.isRequired,
    removeComponent     : PropTypes.func.isRequired,
    duplicateComponent  : PropTypes.func.isRequired,
    editToggleComponent : PropTypes.func.isRequired,
    default_themes      : PropTypes.object.isRequired,
  };

  render() {

    const {customControls, noControls, mode,
           connectDragSource, show, moveBtn} = this.props;

    const isToggleBtnActive = mode == 'view';

    let defControls = <div className={styles.list}>
                        { moveBtn }
                        <Btn active={isToggleBtnActive} onClick={this.props.editToggleComponent}>                       
                          <SomethingWithIcon icon={isToggleBtnActive? Icons.editIcon: Icons.eyeIcon}/>
                        </Btn>
                        <Btn onClick={this.props.duplicateComponent}>
                          <SomethingWithIcon icon={Icons.cloneIcon}/>
                        </Btn>
                        <Btn onClick={this.props.removeComponent}>
                          <SomethingWithIcon icon={Icons.trashIcon}/>
                        </Btn>
                      </div>;
    
    if(noControls) {
      defControls = null;
    }

    const style = {
      display: show ? 'block' : 'none',
    }

    const baseClassName = styles.controls;
    let className = this.props.className ? `${this.props.className} ${baseClassName}` : baseClassName;

    return <div className={className} style={style}>
            { customControls || defControls }
           </div>
  }
}