import styles from './WidgetsPanel.module.scss';

import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import { connect } from 'react-redux';
import {Btn, WidgetIcons, SomethingWithIcon, Icons} from '../../index';
import { showModal } from '../../../actions';
import { ModalTypes } from '../../../constants';

import targetInParent from '../../../utils/targetInParent';
import { getDefaultComponentsMeta,
         getAllComponentsMeta } from '../../../component_meta';

@connect()
export default class WidgetsPanel extends Component {
  static contextTypes = {
    isDemo: PropTypes.bool,
  };

  static PropTypes = {
    showPanel    : PropTypes.bool.isRequired,
    togglePanel  : PropTypes.func.isRequired,
    index        : PropTypes.number.isRequired,
    addComponent : PropTypes.func.isRequired,
    position     : PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.isClickOutsidePanel = this.isClickOutsidePanel.bind(this);
    this.onShowMoreClick = this.onShowMoreClick.bind(this);
    this.onPanelClicked = this.onPanelClicked.bind(this);

    this.state = {
      // show only default components in the very beginning
      showAll    : false,

      defCount   : getDefaultComponentsMeta().length,
      allWidgets : getAllComponentsMeta(),
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.isClickOutsidePanel);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.isClickOutsidePanel);
  }

  render() {
    const {isDemo} = this.context;
    const {showPanel, position} = this.props;
    const {showAll, defCount, allWidgets} = this.state;
    const widgetsToShow = showAll ? allWidgets : allWidgets.slice(0, defCount);

    let showPanelClass = '';

    if(showPanel) showPanelClass += ` ${styles.show}`;
    if(!showAll)  showPanelClass += ` ${styles[`show-${defCount}`]}`;

    if(position) showPanelClass += ` ${styles[position]}`;
    else showPanelClass += ` ${styles.right}`;

    const widgets = widgetsToShow
      .filter(({disableInDemo})=> !(isDemo && disableInDemo))
      .map((widget, i) => {

        let widget_icon = null;
        if (widget.icon === "headerIcon") {
          widget_icon = Icons.headerIcon;
        }
        else if (widget.icon === "codeIcon") {
          widget_icon = Icons.codeIcon;
        }
        else if (widget.icon === "questionIcon") {
          widget_icon = Icons.questionIcon;
        }
        else if (widget.icon === "paintBrushIcon") {
          widget_icon = Icons.paintBrushIcon;
        }
        else if (widget.icon === "tableIcon") {
          widget_icon = Icons.tableIcon;
        }
        else if (widget.icon === "screenIcon") {
          widget_icon = Icons.screenIcon;
        }
        else if (widget.icon === "listIcon") {
          widget_icon = Icons.listIcon;
        }
        else if (widget.icon === "fontIcon") {
          widget_icon = Icons.fontIcon;
        }

        const style = widget.img ? {backgroundImage: `url(/imgs/widgets/${widget.img})`} : {};

        return <li key={i} onClick={this.handleAddClick.bind(this, widget)}>

                { widget.icon ? <SomethingWithIcon icon={widget_icon} iconTop text={widget.title}/> : null }

                { (widget.img ? [
                  <i key={i} style={style} className={styles.icon}/>,
                  <span key={i+1} className={styles.text}>{widget.title}</span>,
                ] : null) }

               </li>;
      });

    const showMoreBtnText = showAll ? 'Less' : 'More';
    const smallPanelClass = showAll ? '' : styles.smallPanel;

    return <div className={`${styles.panel} ${showPanelClass} ${smallPanelClass}`} ref={(node) => this.panelRef = node}
            onClick={this.onPanelClicked}>
            <ul className={styles.list}>

              { widgets }

            </ul>
            <Btn link className={styles['show-button']}
                 onClick={this.onShowMoreClick} text={showMoreBtnText}/>
           </div>;
  }

  handleAddClick(widget, e) {
    e.preventDefault();
    e.stopPropagation();

    const { defaultVal } = widget;
    const {index, addComponent, togglePanel, default_themes} = this.props;

    if(widget.type === 'MarkdownPaste'){
      this.props.dispatch(showModal(ModalTypes.MARKDOWNPASTE, {index}));
    }
    else {
      addComponent({parentHash:'0', data:defaultVal, index});
    }
    togglePanel();
  }

  onPanelClicked(e) {
    e.stopPropagation();
  }

  onShowMoreClick(e) {
    this.setState({
      showAll : !this.state.showAll,
    });
  }

  isClickOutsidePanel(e){
    // do nothing if panel is hidden
    if(!this.props.showPanel) return;

    const addWidgetNode = document.getElementById(`add-widget-button-${this.props.index}`);

    // check if clicked is not on add-widget button
    if(targetInParent(addWidgetNode, e.target)) return;
    if(targetInParent(this.panelRef, e.target)) return;

    this.setState({
      showAll: false,
    }, this.props.togglePanel());
  }
}
