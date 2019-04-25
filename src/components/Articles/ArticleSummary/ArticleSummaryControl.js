// import styles from './ArticleSummary.module.scss';

// import React, {Component, PropTypes} from 'react';

// export default class ArticleSummaryControl extends Component {

//   static PropTypes = {
//     position : PropTypes.array.isRequired // combination of 'top', 'right', 'bottom', 'left'
//   }

//   calcPosition() {
//     const { position } = this.props;

//     if(position.length != 2) {
//       console.error('You should pass 2 of \'top\', \'right\', \'bottom\', \'left\' elements to render controls in a corner')
//       return;
//     }

//     if(position.indexOf('left') != -1 && position.indexOf('top') != -1)
//       return { top: 0, left: 0 };

//     if(position.indexOf('left') != -1 && position.indexOf('bottom') != -1)
//       return { bottom: 0, left: 0 };

//     if(position.indexOf('right') != -1 && position.indexOf('top') != -1)
//       return { top: 0, right: 0 };

//     if(position.indexOf('right') != -1 && position.indexOf('bottom') != -1)
//       return { bottom: 0, right: 0 };
//   }

//   render() {

//     const inlineStyles = this.calcPosition(),
//           className = this.props.className ? `${styles.control} ${this.props.className}` : `${styles.control}`;

//     return (      
//       <div className={className} style={inlineStyles}>
//         { this.props.children }
//       </div>
//     );

//   }

// }