import styles from './ResponsiveImage.module.scss';

import React, {Component, PropTypes} from 'react';

export default class ResponsiveImage extends Component {

  static PropTypes = {
    className : PropTypes.string,
    imageSrc : PropTypes.string,
  };

  render() {

    const baseClassName = 'b-responsive-image';

    const {className, imageSrc} = this.props;

    const responsiveClassName = className ? `${className} ${baseClassName}` : baseClassName;

    return  <div className={responsiveClassName}>
              <img className={styles.image} src={imageSrc}/>
            </div>;

  }

}