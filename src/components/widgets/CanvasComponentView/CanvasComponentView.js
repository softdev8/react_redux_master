import styles from './CanvasComponentView.module.scss';

import React, { Component } from 'react'
import Immutable from 'immutable';

import {Btn} from '../../index';
import EdComponent from '../../EdComponent.js';

/* This class needs to do state maintenance of components. We don't want the components to
report state to redux model so it will just be held here.
*/
export default class CanvasComponentView extends Component{
  
  constructor(props) {
    super(props);

    this.onUpdateClick         = this.onUpdateClick.bind(this);
    this.updateContentState    = this.updateContentState.bind(this);
    this.contentStateFinalized = this.contentStateFinalized.bind(this);

    this.state = {
      component : props.comp.asImmutable(),
      version   : 1,
      iteration: 0,
    }
  }

  updateContentState(imUpdate) {
    const oldContent = this.state.component.get('content');
    const newContent = oldContent.merge(imUpdate);
    if (Immutable.is(newContent, oldContent)) {
      return;
    }
    this.state.component = this.state.component.update('content', ()=> newContent);
    this.state.iteration++;
    this.forceUpdate();
  }

  contentStateFinalized() {
    this.props.onEdCompnentUpdate(this.state.component.toJS());
  }

  onUpdateClick() {
    //Some components don't report periodic state updates. So we need to save them first.
    //Once component save is complete. These components will invoke the contentStateFinalized callback
    if(this.state.component.get('type') === 'SVG' || this.state.component.get('type') === 'Graphviz'
        || this.state.component.get('type') === 'Graph' || this.state.component.get('type') === 'CanvasText'
        || this.state.component.get('type') === 'Matrix') {
      this.refs.componentRef.saveComponent();
    } else {
      this.contentStateFinalized();
    }
  }

  render () {
    const {comp, pageId, config, pageProperties} = this.props;
    const edComponent = {
      mode: comp.get('mode'),
      ref:'componentRef',
      pageId,
      config,
      pageProperties,
    };

    return <div className={styles['component-wrapper']}>
            <div className={styles.component}>
              <EdComponent comp={this.state.component} {...edComponent}
                           updateContentState={this.updateContentState} 
                           contentStateFinalized={this.contentStateFinalized}
                           iteration={this.state.iteration}/>
            </div>

            <div className={styles.buttons}>
              <Btn default onClick={this.props.onEdCompnentCancelUpdate}>Cancel</Btn>
              <Btn default className='b-btn_green-border' onClick={this.onUpdateClick}>Update</Btn>
            </div>

           </div>;
  }
};