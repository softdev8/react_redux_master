import styles from './PageEditorToolbar.module.scss';

import React, {PropTypes, Component} from 'react';
import {Grid, Col, Row, ButtonGroup} from 'react-bootstrap';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { connect } from 'react-redux';

import PanelContainer from '../../commonUI/PanelContainer/PanelContainer';
import PanelBody from '../../common/PanelBody.js';
import AlignmentButton from '../AlignmentButton/AlignmentButton';
import {SomethingWithIcon, ModalWindow, Icons} from '../../index';

import { ModalTypes } from '../../../constants';
import { showModal } from '../../../actions';


const onAlignmentChange = (onPagePropertyChange)=>(changedAlignment)=>onPagePropertyChange('pageAlign', changedAlignment)

@connect( ({ajaxMode:{enabled}}) => ({
  isDemo: !enabled
}))
export default class PageEditorToolbar extends Component{
  static PropTypes = {
    pageProperties       : PropTypes.object.isRequired,
    onPagePropertyChange : PropTypes.func.isRequired,
    isDemo               : PropTypes.bool.isRequired,
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    let align = 'center';

    const {pageProperties, onPagePropertyChange, isDemo} = this.props;

    if(pageProperties && pageProperties.pageAlign){
      align = pageProperties.pageAlign;
    }

    return <div className={styles.toolbar}>
            <div className={styles.alignment}>
              <AlignmentButton alignVal='left' 
                               active={align == 'left'}
                               onAlignmentChange={onAlignmentChange(onPagePropertyChange)} 
                               icon={Icons.alignLeftIcon}/>
              <AlignmentButton alignVal='center' 
                               active={align == 'center'}
                               onAlignmentChange={onAlignmentChange(onPagePropertyChange)} 
                               icon={Icons.alignCenterIcon}/>
              <AlignmentButton alignVal='right' 
                               active={align == 'right'}
                               onAlignmentChange={onAlignmentChange(onPagePropertyChange)} 
                               icon={Icons.alignRightIcon}/>
            </div>

            <div className={styles['common-info']}>
              <span>Creation date: 1 September 2015</span>
              <span>Last Modified: 19:54 2 September 2015</span>
            </div>

            <div className={styles.settings} onClick={()=>{
                this.props.dispatch(showModal(ModalTypes.ARTICLESETTINGS));
              }}>
              {!isDemo && <SomethingWithIcon icon={Icons.cogIcon}/>}
            </div>

          </div>;
  }
}