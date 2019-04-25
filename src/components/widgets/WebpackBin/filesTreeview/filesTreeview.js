import React from 'react';
import classnames from 'classnames';
import styles from './filesTreeview.module.scss';
const Tree = require('../../../helpers/react-ui-tree/react-ui-tree.js');

const TreeView = ({ treeHeight, treeWidth, ...props }) => {
	const treeStyle = classnames(styles.treeWrapperLight, styles.treeviewLight);

	return (
	    <div className={treeStyle} style={{ height: treeHeight, width: treeWidth }}>
	      <Tree
	        {...props}
	        paddingLeft={30}
	      />
	    </div>
	);
};

export default TreeView;
