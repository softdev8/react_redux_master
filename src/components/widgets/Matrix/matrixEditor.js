import styles from './matrixEditor.module.scss';
import {findDOMNode} from 'react-dom';
import {FormControl, OverlayTrigger, Tooltip} from 'react-bootstrap';

import React,{Component, PropTypes} from 'react';

import {SomethingWithIcon} from '../../index';

const CaptionComponent = require('../../CaptionComponent/CaptionComponent');
const ColorPicker = require('../../common/colorpicker');
const Button = require('../../common/Button');
const Icon = require('../../common/Icon');

const svgjs = require('svg.js');

export default class MatrixEditor extends Component {

  static PropTypes = {
    mode  : PropTypes.string.isRequired,
    content : PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.addCol - this.addCol.bind(this);
    this.addRow = this.addRow.bind(this);
    this.generateColHeader = this.generateColHeader.bind(this);
    this.generateRowHeader = this.generateRowHeader.bind(this);
    this.getCell = this.getCell.bind(this);
    this.getCellStrokeStyle = this.getCellStrokeStyle.bind(this);
    this.getCellTextStyle = this.getCellTextStyle.bind(this);
    this.getDefaultCell = this.getDefaultCell.bind(this);
    this.getDefaultCellStrokeStyle = this.getDefaultCellStrokeStyle.bind(this);
    this.getDefaultCellTextStyle = this.getDefaultCellTextStyle.bind(this);
    this.getDefaultColumn = this.getDefaultColumn.bind(this);
    this.getFirstSelectedCell = this.getFirstSelectedCell.bind(this);
    this.getSelectedCellStrokeStyle = this.getSelectedCellStrokeStyle.bind(this);
    this.handleAddCol = this.handleAddCol.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.handleCellBackgroundColorChange = this.handleCellBackgroundColorChange.bind(this);
    this.handleCellClicked = this.handleCellClicked.bind(this);
    this.handleCellStrokeColorChange = this.handleCellStrokeColorChange.bind(this);
    this.handleCellTextSizeChange = this.handleCellTextSizeChange.bind(this);
    this.handleCellValueUpdate = this.handleCellValueUpdate.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleRemoveCol = this.handleRemoveCol.bind(this);
    this.handleRemoveRow = this.handleRemoveRow.bind(this);
    this.initializeMatrix = this.initializeMatrix.bind(this);
    this.moveSelectionToNextCell = this.moveSelectionToNextCell.bind(this);
    this.selectCellsAfterUpdate = this.selectCellsAfterUpdate.bind(this);
    this.unselectAllCells = this.unselectAllCells.bind(this);

    this.state = {
      root_svg : null,
      selected_cell_color: null,
      selected_cell_stroke_color: null,
      selected_cell_text_size: null,
      selected_cells: [],
      cached_cell_svgs: [],
      matrix_redraw_required: false,
    };
  }

  getDefaultCell() {
    return {
      text: "",
      width: 40,
      height: 40,
      color: "#caff97",
    };
  }

  getCell(text, color, strokeColor, textSize) {
    return {
      text,
      width: 40,
      height: 40,
      color,
      stroke_color: strokeColor,
      text_size: textSize,
    };
  }

  getDefaultColumn() {
    return {
      max_width: 40,
      cells: [],
    };
  }

  getDefaultCellStrokeStyle() {
    return { color: '#000000', opacity: 1, width: 1 };
  }

  getCellStrokeStyle(color) {
    if (color === null) {
      return { color: '#000000', opacity: 0, width: 0 };
    } else {
      return { color, opacity: 1, width: 1 };
    }
  }

  getSelectedCellStrokeStyle() {
    return { color: '#3A9FBF', opacity: 1, width: 5 };
  }

  getDefaultCellTextStyle() {
    return { size: 20, family: 'Verdana' };
  }

  getCellTextStyle(fontSize) {
    return { size: fontSize, family: 'Verdana' };
  }

  handleCellClicked(cell_instance) {
    this.unselectAllCells();
    cell_instance.cell_svg_rect.stroke(this.getSelectedCellStrokeStyle());
    this.state.selected_cells.push({ row: cell_instance.row, col: cell_instance.col });

    const { matrix_data } = this.props.content;

    if (this.state.selected_cells.length === 1) {
      const cell_data = matrix_data.cols[cell_instance.col].cells[cell_instance.row];
      const $input = findDOMNode(this.cellTextInputRef);

      $input.value = cell_data.text;
      $input.focus();

      const newState = {};
      newState.selected_cell_color = cell_data.color;
      newState.selected_cell_text_size = cell_data.text_size === undefined ? '20' : cell_data.text_size;
      newState.selected_cell_stroke_color = cell_data.stroke_color === undefined ? '#000000' : cell_data.stroke_color;
      this.setState(newState);

    } else {
      // TODO: Handle Multi-select
    }
  }

  unselectAllCells() {
    // console.log(this.state.root_svg);
    // let childNodes = this.state.root_svg.node.childNodes;
    // console.log(childNodes);

    // console.log(childNodes[4].instance);

    // for (let i = 0; i < childNodes.length; i++) {
    //   if (childNodes[i].instance.cell_svg_rect != null) {
    //     console.log(i, childNodes[i].instance.cell_svg_rect);
    //     console.log(i, childNodes[i].instance.cell_svg_rect.stroke);
    //     childNodes[i].instance.cell_svg_rect.stroke(this.getDefaultCellStrokeStyle());
    //   }
    // }

    // for (let i = 0; i < this.state.selected_cells.length; i++) {
    //   this.state.selected_cells[i].fill(false);
    // }

    // this.state.selected_cells.length = 0;

    this.state.selected_cells.forEach((cell) => {
      const stroke_color = this.props.content.matrix_data.cols[cell.col].cells[cell.row].stroke_color;

      let stroke_style = this.getDefaultCellStrokeStyle();
      if (stroke_color !== undefined) {
        stroke_style = this.getCellStrokeStyle(stroke_color);
      }

      this.state.cached_cell_svgs[cell.col][cell.row].cell_svg_rect.stroke(stroke_style);

    });

    this.state.selected_cells = [];
  }

  getFirstSelectedCell() {
    if (this.state.selected_cells.length >= 1) {
      return this.state.selected_cells[0];
    }

    return null;
  }

  initializeMatrix() {
    let domNode = this.matrix_areaRef;
    let { matrix_data } = this.props.content;

    this.state.root_svg = svgjs(domNode).size(
      matrix_data.width,
      matrix_data.height);

    this.state.root_svg.viewbox(0, 0,
      matrix_data.width,
      matrix_data.height);

    let start_x = matrix_data.left_padding;
    let start_y = matrix_data.top_padding;

    let row_gap = matrix_data.row_gap;
    let col_gap = matrix_data.col_gap;

    let current_x = start_x;
    let current_y = start_y;

    this.state.cached_cell_svgs = [];

    for (let i = 0; i < matrix_data.cols.length; i++) {
      current_y = start_y

      let col = matrix_data.cols[i];
      let cells = col.cells;
      let col_width = col.max_width;
      let row_svgs = [];

      for (let j = 0; j < cells.length; j++) {
        let nested = this.state.root_svg.nested();

        let opacity = 1;
        let color = null;
        if (cells[j].color) {
          color = cells[j].color;
        } else {
          opacity = 0;
        }

        let rect = nested.rect(col_width, cells[j].height).attr({ x: current_x, y: current_y, fill: cells[j].color, 'fill-opacity': opacity });
        rect.radius(3);

        if (cells[j].stroke_color !== undefined) {
          rect.stroke(this.getCellStrokeStyle(cells[j].stroke_color));
        } else {
          rect.stroke(this.getDefaultCellStrokeStyle());
        }

        let textStyle = this.getDefaultCellTextStyle();
        if(cells[j].text_size !== undefined) {
          textStyle = this.getCellTextStyle(cells[j].text_size);
        }

        let text = nested.plain(cells[j].text).font(textStyle);
        let textBBox = text.bbox();

        // Center-align text
        text.x(current_x + col_width/2 - textBBox.width/2);
        text.y(current_y + cells[j].height/2 - textBBox.height/2);

        current_y += col.cells[j].height + row_gap;

        nested.row = j;
        nested.col = i;
        nested.cell_svg_rect = rect;
        nested.cell_svg_text = text;

        row_svgs.push(nested);

        let that = this;

        nested.click(function(e) {
          e.stopPropagation();
          e.preventDefault();
          that.handleCellClicked(this);
        });
      }

      current_x += col_width + col_gap

      this.state.cached_cell_svgs.push(row_svgs);
    }
  }

  // Handling the tab key pressed.
  // It moves the selection to next cell if possible
  moveSelectionToNextCell() {
    let selected_cells = this.state.selected_cells;
    let { matrix_data } = this.props.content;

    // We only support selection to next cell when only a single cell is
    // selected
    if (selected_cells.length !== 1) {
      return;
    }

    let col = selected_cells[0].col;
    let row = selected_cells[0].row;

    let new_col = null;
    let new_row = null;

    if (col < (matrix_data.cols.length - 1)) {
      // Room to move to the next Column
      new_col = col + 1;
      new_row = row;
    } else if (row < (matrix_data.cols[0].cells.length - 1)) {
      // Can move to next Row. First Column
      new_col = 0;
      new_row = row + 1;
    } else {
      // Cannot move any further. Which means we are at the last cell
      // If it's not the first cell (meaning it's the only cell), lets
      // go to the first cell
      if (col === 0 && row === 0) {
        return;
      }

      new_col = 0;
      new_row = 0;
    }

    if (new_col !== null && new_row !== null) {
      selected_cells[0].col = new_col;
      selected_cells[0].row = new_row;

      let cell_data = matrix_data.cols[new_col].cells[new_row];
      const $input = findDOMNode(this.cellTextInputRef);
      $input.value = cell_data.text;
      $input.focus();

      this.state.cached_cell_svgs[col][row].cell_svg_rect.stroke(this.getDefaultCellStrokeStyle());
      this.state.cached_cell_svgs[new_col][new_row].cell_svg_rect.stroke(this.getSelectedCellStrokeStyle());
    }
  }

  handleCellValueUpdate(e) {

    let selected_cells = this.state.selected_cells;

    if (selected_cells.length > 0) {
      let { matrix_data } = this.props.content;

      let value = findDOMNode(this.cellTextInputRef).value;

      // Create a new Text Object
      let tempText = this.state.root_svg.defs().text(value).font(this.getDefaultCellTextStyle());
      let textBBox = tempText.bbox();
      let textWidth = textBBox.width;
      let new_columnWidth = textWidth + matrix_data.cell_left_padding +
        matrix_data.cell_right_padding;

      if (new_columnWidth < matrix_data.minimum_cell_width) {
        // TODO: Opportunity to optimize here.
        // If required width is minimum, we don't need any width updates.
        // Just put in the text
        new_columnWidth = matrix_data.minimum_cell_width;
      }

      // Remove temporary text object as it's no longer needed
      tempText.remove();

      for (let i = 0; i < selected_cells.length; i++) {
        let col_index = selected_cells[i].col;
        let row_index = selected_cells[i].row;

        let col_data = matrix_data.cols[col_index];
        let rows = col_data.cells;
        let maximumColWidth = 0;

        for (let j = 0; j < rows.length; j++) {
          if (j === row_index) {
            col_data.cells[j].text = value;
            col_data.cells[j].width = new_columnWidth
          }

          if (maximumColWidth < col_data.cells[j].width) {
            maximumColWidth = col_data.cells[j].width;
          }
        }

        matrix_data.width += maximumColWidth - col_data.max_width;
        col_data.max_width = maximumColWidth;
      }

      // If the update happened using Tab key
      if (e.key === 'Tab') {
        e.stopPropagation();
        e.preventDefault();
        this.moveSelectionToNextCell();
      }

      this.state.matrix_redraw_required = true;
      this.props.updateContentState({
        matrix_data,
      });
    }
  }

  handleCellBackgroundColorChange(colorValue) {
    let selected_cells = this.state.selected_cells;

    if (selected_cells.length > 0) {
      let { matrix_data } = this.props.content;

      for (let i = 0; i < selected_cells.length; i++) {
        let col_index = selected_cells[i].col;
        let row_index = selected_cells[i].row;

        matrix_data.cols[col_index].cells[row_index].color = colorValue;
      }

      this.state.selected_cell_color = colorValue;

      this.state.matrix_redraw_required = true;
      this.props.updateContentState({
        matrix_data,
      });
    }
  }

  handleCellStrokeColorChange(colorValue) {
    let selected_cells = this.state.selected_cells;

    if (selected_cells.length > 0) {
      let { matrix_data } = this.props.content;

      for (let i = 0; i < selected_cells.length; i++) {
        let col_index = selected_cells[i].col;
        let row_index = selected_cells[i].row;

        matrix_data.cols[col_index].cells[row_index].stroke_color = colorValue;
      }

      this.state.selected_cell_stroke_color = colorValue;

      this.state.matrix_redraw_required = true;
      this.props.updateContentState({
        matrix_data,
      });
    }
  }

  handleCellTextSizeChange(e) {
    let selected_cells = this.state.selected_cells;

    if (selected_cells.length > 0) {
      let { matrix_data } = this.props.content;

      for (let i = 0; i < selected_cells.length; i++) {
        let col_index = selected_cells[i].col;
        let row_index = selected_cells[i].row;

        matrix_data.cols[col_index].cells[row_index].text_size = e.target.value;
      }

      this.state.selected_cell_text_size = e.target.value;

      this.state.matrix_redraw_required = true;
      this.props.updateContentState({
        matrix_data,
      });
    }
  }

  generateRowHeader(e) {
    this.addCol(0, true);
  }

  handleAddRow(e) {

    this.addRow();
  }

  addRow(rowPosition, generateHeader) {
    let selected_cell = this.getFirstSelectedCell();

    let row = null;
    let { matrix_data } = this.props.content;

    if (selected_cell) {
      row = selected_cell.row;
    } else if (matrix_data.cols.length > 0) {
      row = matrix_data.cols[0].cells.length - 1;
    } else {
      return;
    }

    let targetRow = row + 1;
    if(rowPosition !== null && rowPosition !== undefined) {
      targetRow = rowPosition;
    }

    for (let i = 0; i < matrix_data.cols.length; i++) {
      let cell = this.getDefaultCell();
      if (generateHeader) {
        cell = this.getCell(i, null, null, 12);
      }
      matrix_data.cols[i].cells.splice(targetRow, 0, cell);
    }

    matrix_data.height += matrix_data.minimum_cell_height +
      matrix_data.row_gap;

    this.state.matrix_redraw_required = true;
    this.props.updateContentState({
        matrix_data,
    });
  }

  handleRemoveRow(e) {
    if (this.state.selected_cells.length !== 1) {
      return;
    }

    let selected_cell = this.getFirstSelectedCell();

    if (!selected_cell) {
      return;
    }

    let { matrix_data } = this.props.content;
    let row = selected_cell.row;

    if (matrix_data.cols[0].cells.length === 1) {
      // Cannot delete the last row
      return;
    }

    let rowHeight = matrix_data.cols[0].cells[0].height;

    for (let i = 0; i < matrix_data.cols.length; i++) {
      matrix_data.cols[i].cells.splice(row, 1);
    }

    matrix_data.height -= rowHeight + matrix_data.row_gap;

    this.state.matrix_redraw_required = true;
    this.props.updateContentState({
        matrix_data,
    });
  }

  generateColHeader(e) {
    this.addRow(0, true);
  }

  handleAddCol(e) {
    this.addCol();
  }

  addCol(colPosition, generateHeader) {
    let selected_cell = this.getFirstSelectedCell();

    let col =  null;
    let { matrix_data } = this.props.content;

    if (selected_cell) {
      col = selected_cell.col;
    } else {
      // Only add columns without selection when there exists a row
      if (matrix_data.cols[0].cells.length > 0) {
        col = matrix_data.cols.length - 1;
      } else {
        return;
      }
    }

    let targetCol = col + 1;
    if (colPosition !== null && colPosition !== undefined) {
      targetCol = colPosition;
    }

    let rowCount = matrix_data.cols[col].cells.length;
    let rows = [];

    let new_column = this.getDefaultColumn();

    for (let i = 0; i < rowCount; i++) {
      let cell = this.getDefaultCell();
      if (generateHeader) {
        cell = this.getCell(i, null, null, 12);
      }
      new_column.cells.push(cell);
    }

    matrix_data.cols.splice(targetCol, 0, new_column);

    matrix_data.width += matrix_data.minimum_cell_width +
      matrix_data.col_gap;

    this.state.matrix_redraw_required = true;
    this.props.updateContentState({
        matrix_data,
    });
  }

  handleRemoveCol(e) {
    if (this.state.selected_cells.length !== 1) {
      return;
    }

    let selected_cell = this.getFirstSelectedCell();

    if (!selected_cell) {
      return;
    }

    let { matrix_data } = this.props.content;

    if (matrix_data.cols.length === 1) {
      // Cannot delete the last column
      return;
    }

    let col = selected_cell.col;
    let rowCount = matrix_data.cols[col].cells.length;
    let colWidth = matrix_data.cols[col].max_width;


    matrix_data.cols.splice(col, 1);
    matrix_data.width -= colWidth + matrix_data.col_gap;

    this.state.matrix_redraw_required = true;
    this.props.updateContentState({
        matrix_data,
    });
  }

  // Whenever a new render is called, Matrix is redrawn.
  // However, we need to retain the cell section.
  // Hence, this method goes over all the selected cells and draws
  // a selection border around them
  selectCellsAfterUpdate() {
    let { selected_cells, cached_cell_svgs} = this.state;

    for(let i = selected_cells.length - 1; i >= 0; i--) {
      let cell = selected_cells[i];

      if (cached_cell_svgs.length > cell.col &&
          cached_cell_svgs[cell.col].length > cell.row) {
        cached_cell_svgs[cell.col][cell.row].cell_svg_rect.stroke(
          this.getSelectedCellStrokeStyle());
      } else {
        // This Cell got deleted
        // Remove it from selected cells
        selected_cells.splice(i, 1);
      }
    }
  }

  componentDidMount() {
    this.initializeMatrix();
  }

  componentDidUpdate() {
    if (this.state.matrix_redraw_required) {
      this.state.root_svg.remove();
      this.initializeMatrix();
      this.selectCellsAfterUpdate();
      this.state.matrix_redraw_required = false;
    }
  }

  saveComponent() {
    if (this.state.root_svg) {
      this.unselectAllCells();
      let { matrix_data } = this.props.content;
      let svg_string = this.state.root_svg.svg();
      let svg_width = matrix_data.width;
      let svg_height = matrix_data.height;

      this.props.updateContentState({
        svg_string,
        svg_width,
        svg_height,
        matrix_data,
      });
    }
  }

  handleCaptionChange(caption) {
    this.props.updateContentState({
      caption,
    });
  }

  handleKeyDown(e) {
    if (e.key != 'Enter' && e.key != 'Tab') {
      return;
    }


    if (e.target.name === 'cellText') {
      this.handleCellValueUpdate(e);
    }
  }

  createTooltipObject(tooltip_string) {
    return <Tooltip id={tooltip_string}>{ tooltip_string }</Tooltip>;
  }

  render(){
    const {mode, content} = this.props;

    let captionComponent = null;

    if (this.props.config == null || this.props.config.disableCaption == null || this.props.config.disableCaption != true) {
      captionComponent = <CaptionComponent
        caption={this.props.content.caption}
        readOnly={false}
        onCaptionChange={this.handleCaptionChange}/>;
    }

    let { matrix_data } = this.props.content;
    let width = matrix_data.width + 5;
    let height = matrix_data.height + 5;

    const addRowButton = <OverlayTrigger placement='top' overlay={this.createTooltipObject("Adds row below")}>
                      <Button style={{marginLeft:5}} sm outlined bsStyle='darkgreen45'
                                    onClick={this.handleAddRow}>
                            <Icon glyph='fa fa-plus' style={{fontSize:15}}/>
                              Row
                      </Button>
                    </OverlayTrigger>;

    const removeRowButton = <OverlayTrigger placement='top' overlay={this.createTooltipObject("Removes selected row")}>
                      <Button style={{marginLeft:5}} sm outlined bsStyle='darkgreen45'
                                    onClick={this.handleRemoveRow}>
                            <Icon glyph='fa fa-trash' style={{fontSize:15}}/>
                              Row
                      </Button>
                    </OverlayTrigger>;

    const addColButton = <OverlayTrigger placement='top' overlay={this.createTooltipObject("Adds column to right")}>
                      <Button style={{marginLeft:5}} sm outlined bsStyle='darkgreen45'
                                    onClick={this.handleAddCol}>
                            <Icon glyph='fa fa-plus' style={{fontSize:15}}/>
                              Col
                      </Button>
                    </OverlayTrigger>;

    const removeColButton = <OverlayTrigger placement='top' overlay={this.createTooltipObject("Removes selected column")}>
                      <Button style={{marginLeft:5}} sm outlined bsStyle='darkgreen45'
                                    onClick={this.handleRemoveCol}>
                            <Icon glyph='fa fa-trash' style={{fontSize:15}}/>
                              Col
                      </Button>
                    </OverlayTrigger>;

    let children = <div>
                  <div className={`${styles.menu} edcomp-toolbar`}>
                    <div className={styles.row}>
                      <div className={styles['row-title']}>Matrix</div>
                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set Cell Value")}>
                          <FormControl style={{marginLeft:8 , marginRight:8, width:'200px', display:'inline'}} ref={node => this.cellTextInputRef = node}
                            name='cellText' onKeyDown={this.handleKeyDown}/>
                        </OverlayTrigger>
                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set cell color")}>
                          <ColorPicker className={`${styles.colorpicker}`}
                            onChange={this.handleCellBackgroundColorChange} value={this.state.selected_cell_color} >
                            <SomethingWithIcon icon='fa fa-font'/>
                          </ColorPicker>
                        </OverlayTrigger>
                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set cell color")}>
                          <ColorPicker className={`${styles.colorpicker}`}
                            onChange={this.handleCellStrokeColorChange} value={this.state.selected_cell_stroke_color} >
                            <SomethingWithIcon icon='fa fa-font'/>
                          </ColorPicker>
                        </OverlayTrigger>
                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Set cell text size")}>
                          <FormControl componentClass="select" style={{ marginLeft:8 }} value={this.state.selected_cell_text_size || ''} onChange={this.handleCellTextSizeChange}>
                              <option value="10">10</option>
                              <option value="12">12</option>
                              <option value="14">14</option>
                              <option value="16">16</option>
                              <option value="18">18</option>
                              <option value="20">20</option>
                          </FormControl>
                        </OverlayTrigger>
                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Generate Column Header")}>
                          <Button style={{marginLeft:5}} sm outlined bsStyle='darkgreen45'
                                        onClick={this.generateColHeader}>
                                <Icon glyph='fa fa-plus' style={{fontSize:15}}/>
                                  Column Header
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement='top' overlay={this.createTooltipObject("Generate Row Header")}>
                          <Button style={{marginLeft:5}} sm outlined bsStyle='darkgreen45'
                                        onClick={this.generateRowHeader}>
                                <Icon glyph='fa fa-plus' style={{fontSize:15}}/>
                                  Row Header
                          </Button>
                        </OverlayTrigger>

                        {addRowButton}
                        {removeRowButton}
                        {addColButton}
                        {removeColButton}
                    </div>
                  </div>
                  <div>
                    <div className={styles.matrix_area} style={{width: `${width}px`, height: `${height}px`}} ref={node => this.matrix_areaRef = node}></div>
                  </div>
                </div>;


    return <div>
            {children}
            {captionComponent}
           </div>;
  }
}
