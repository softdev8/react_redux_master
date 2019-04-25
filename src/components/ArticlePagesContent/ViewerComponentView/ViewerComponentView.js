import styles from './ViewerComponentView.module.scss';

import React , { Component } from 'react'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PureComponent from 'react-pure-render/component';

import ComponentPanel from '../ComponentPanel/ComponentPanel';
import EdComponent from '../../EdComponent';

@DragDropContext(HTML5Backend)
export default class ViewerComponentView extends PureComponent{
  render () {
    return <div className={styles.preview}>
            <EdComponent {...this.props} ref="componentRef" mode="view"/>
           </div>;
  }
}