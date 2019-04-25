import styles from './AjaxLoader.module.scss';

import React from 'react'

class AjaxLoader extends React.Component {
  render() {
    //Keeping older version of ajax loader that used an image in case we have any issues with the new version
    //<img src='/imgs/ajax-loader.gif'/>
    return (
      <div className={styles['ajax-loader']} style={{display: this.props.display}}>
        <div className={styles.spinner}/>
        <span className={styles['loading-exp']} dangerouslySetInnerHTML={{__html: this.props.content}}/><p className={styles.loading}><span>.</span><span>.</span><span>.</span></p>
      </div>
    );
  }
}

module.exports = AjaxLoader;