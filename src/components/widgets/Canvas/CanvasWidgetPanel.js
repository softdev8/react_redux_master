import styles from './CanvasWidgetPanel.module.scss';

import React, {Component} from 'react';

import Icon from '../../common/Icon';
import Input from '../../common/Input';
import {SearchComponent} from '../../index';
import {getCanvasSupportedComponentsMeta} from '../../../component_meta';
import CanvasComponentWidgetItem from './CanvasComponentWidgetItem';

export default class CanvasWidgetPanel extends Component{
  constructor(props) {
    super(props);

    this.onSearchTextChange = this.onSearchTextChange.bind(this);

    this.state = {
      widgets    : getCanvasSupportedComponentsMeta(),
      searchText : '',
    };
  }

  onSearchTextChange(searchText) {
    this.setState({
      searchText
    });
  }

  render() {
    const addComponent = this.props.addComponent;
    const searchText = this.state.searchText ? this.state.searchText.searchString : '';

    const widgets = this.state.widgets.map( (compWidget, i) => {

      if(compWidget.title.toLowerCase().indexOf(searchText) == -1) {
        return null;
      } else {
        return <li key={i} title={compWidget.title}>
                 <CanvasComponentWidgetItem widget={compWidget} addComponent={addComponent}/>
               </li>;
      }
    });

    return (
      <div className={styles.panel}>
        {/*<SearchComponent searchHandler={this.onSearchTextChange} placeholder='Search'/>*/}
        <ul className={styles.list}>
          {widgets}
        </ul>
      </div>
    );
  }
}