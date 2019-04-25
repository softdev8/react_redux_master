import styles from './CanvasComponentWidgetItem.module.scss';

import React, {Component, PropTypes} from 'react';
import { DragSource } from 'react-dnd';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

import {SomethingWithIcon, Icons} from '../../index';

const widgetItemSource = {
  beginDrag(props) {
    return {
      type: props.widget.type,
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      props.addComponent(item.type);
    }
  },
};

@DragSource('CANVASCOMP', widgetItemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class CanvasComponentWidgetItem extends Component{

  static PropTypes = {
    widget       : PropTypes.object.isRequired,
    addComponent : PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleAddClick = this.handleAddClick.bind(this);
  }

  handleAddClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.addComponent(this.props.widget.type);
  }

  shouldComponentUpdate(nextProps, nextState){
    if(this.props.widget.svg_string === nextProps.widget.svg_string){
      return false;
    }

    return true;
  }

  render() {
    const { isDragging, connectDragSource, widget } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    let style = '';
    let widget_icon = null;

    const tooltip = <Tooltip id={widget.title}>{ widget.title }</Tooltip>;

    if (widget.icon === "headerIcon") {
      widget_icon = <SomethingWithIcon icon={Icons.headerIcon} iconTop text={widget.title}/>;
    }
    else if (widget.icon === "codeIcon") {
      widget_icon = <SomethingWithIcon icon={Icons.codeIcon} iconTop text={widget.title}/>;
    }
    else if (widget.icon === "questionIcon") {
      widget_icon = <SomethingWithIcon icon={Icons.questionIcon} iconTop text={widget.title}/>;
    }
    else if (widget.icon === "paintBrushIcon") {
      widget_icon = <SomethingWithIcon icon={Icons.paintBrushIcon} iconTop text={widget.title}/>;
    }
    else if (widget.icon === "tableIcon") {
      widget_icon = <SomethingWithIcon icon={Icons.tableIcon} iconTop text={widget.title}/>;
    }
    else if (widget.icon === "screenIcon") {
      widget_icon = <SomethingWithIcon icon={Icons.screenIcon} iconTop text={widget.title}/>;
    }
    else if (widget.icon === "listIcon") {
      widget_icon = <SomethingWithIcon icon={Icons.listIcon} iconTop text={widget.title}/>;
    }
    else if (widget.icon === "fontIcon") {
      widget_icon = <SomethingWithIcon icon={Icons.fontIcon} iconTop text={widget.title}/>;
    }
    else if (widget.icon) {
      widget_icon = widget.icon ? [<SomethingWithIcon icon={widget.icon} iconTop text={widget.title}/>]: null;
    } else if (widget.img) {
      style = {backgroundImage: `url(/imgs/widgets/${widget.img})`};
      widget_icon = [
        <i key={'key_canvasComponentWidgetItem_1'} style={style} className={styles.icon}/>,
        <span key={'key_canvasComponentWidgetItem_2'} className={styles.text}>{widget.title}</span>,
      ];
    } else {
      style = {backgroundImage: `url(data:image/svg+xml;base64,${new Buffer(widget.svg_string).toString('base64')})`};
      widget_icon = [
        <i key={'key_canvasComponentWidgetItem_3'} className={styles.icon} style={style}/>,
        <span key={'key_canvasComponentWidgetItem_4'} className={styles.text}>{widget.title}</span>,
      ];
    }

    return  connectDragSource(
      <div style={{width: '100%'}}>
        <OverlayTrigger placement='left' overlay={tooltip}>
          <div className={styles.widget} onClick={this.handleAddClick}>
            { widget_icon }
          </div>
        </OverlayTrigger>
      </div>
    );
  }
}
