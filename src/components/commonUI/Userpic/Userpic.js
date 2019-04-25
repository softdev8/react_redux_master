import styles from './Userpic.module.scss';

import React, {PropTypes, Component} from 'react';
import {findDOMNode} from 'react-dom';
import {Icons} from '../../index';

export default class Userpic extends Component {

  static PropTypes = {
    // string or node
    image : PropTypes.node.isRequired,
  };

  componentDidMount(){
    if(this.refs.img){
      $(findDOMNode(this.refs.img)).bind('error',function(ev){
        //error has been thrown
        $(this).attr('src','/imgs/avatars/avatar-new.png');
      });
    }
  }

  componentDidUpdate(){
    if(this.refs.img){
      $(findDOMNode(this.refs.img)).unbind('error').bind('error',function(ev){
        //error has been thrown
        $(this).attr('src','/imgs/avatars/avatar-new.png');
      });
    }
  }

  render() {
    const {image} = this.props;

    const picture = !image ? <i className={styles['icon-wrap']}>{ Icons.noAvatar }</i> 
                     : <img ref="img" src={image}/>;

    return  <div className={styles.picture}>
              { picture }
            </div>;
  }
}