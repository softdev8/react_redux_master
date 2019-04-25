import React from 'react'
import {findDOMNode} from 'react-dom';
var Handsontable = require('handsontable');
// -----------------------------------------------------------------------------
// Column Model
// -----------------------------------------------------------------------------

/*
 * The Column Model is used to keep track of the grid columns properties
 * while being in edit mode. Hooks on handsontable component are used to listen
 * for those properties changes. The initial configuration is passed to the
 * constructor as follows:
 *
 * config: {
 *   columns: [
 *     {
 *       type: '<type>',
 *       width: <width>,
 *       alignment: '<alignment>'
 *     }
 *   ]
 * }
 */

const Input = require('../common/Input');
const Checkbox = require('../common/Checkbox');
const Label = require('../common/Label');

const ColumnModel = function (config) {
  this.config = $.extend(true, {}, config);
};

ColumnModel.prototype = {
  getColumnType(col) {
    return this.config.columns[col].type;
  },

  setColumnType(col, value) {
    this.config.columns[col].type = value;
  },

  getColumnAlignment(col) {
    return this.config.columns[col].alignment;
  },

  getColWidths() {
    const colWidths = [];
    for (let i = 0; i < this.config.columns.length; i++) {
      colWidths[i] = this.config.columns[i].width;
    }
    return colWidths;
  },

  getConfig() {
    return $.extend(true, {}, this.config);
  },

  // When a new column is added, insert a new one in the current column model.
  getAfterCreateCol() {
    const self = this;
    return function (index, amount) {
      const newColumns = [];
      for (let i = 0; i < amount; i++) {
        newColumns[i] = {
          type: 'numeric',
          width: 100,
        }
      }
      [].splice.apply(self.config.columns, [index, 0].concat(newColumns));
    }
  },

  // When a column is removed, remove the corresponding one in the column model.
  getAfterRemoveCol() {
    const self = this;
    return function (index, amount) {
      self.config.columns.splice(index, amount);
    };
  },

  // When a column is moved around, update its position in the column model.
  getAfterColumnMove() {
    const self = this;
    // console.log('getAfterColumnMove');
    return function (from, to) {
      const column = self.config.columns.splice(from, 1)[0];
      self.config.columns.splice(to, 0, column);
      this.updateSettings({data: getHotData(this, false), colWidths: self.getColWidths()});
    };
  },

  // When a column is resized, update its width property.
  getAfterColumnResize() {
    const self = this;
    return function (col, size) {
      self.config.columns[col].width = size;
    };
  },

  // When the column alignment is changed, we detect that change through the
  // change of the CSS class of that column's cells. Note that we assume
  // that all cells in the column have the same alignment.
  getAfterSetCellMeta() {
    const self = this;
    return function (row, col, key, val) {
      // only consider first row, because the whole column has same alignment
      if (row == 0 && key == 'className') {
        self.config.columns[col].alignment = val;
      }
    };
  },
};


// -----------------------------------------------------------------------------
// Column Type Menu
// -----------------------------------------------------------------------------

/*
 * The column type menu is a contextual menu that is added to the column header
 * and allows to change the column type.
 */
const ColumnTypeMenu = {
  // We build the type menu after the column header is created
  getAfterGetColHeader(cm) {
    return function (col, TH) {
      if (col < 0) {
        return;
      }
      $(TH.firstChild).children('.changeType').remove();
      col = this.manualColumnPositions.indexOf(col);
      const instance = this;
      const menu = ColumnTypeMenu.buildMenu(cm.getColumnType(col));
      const button = ColumnTypeMenu.buildButton();
      ColumnTypeMenu.addButtonMenuEvent(button, menu);
      Handsontable.Dom.addEvent(menu, 'click', function (event) {
        if (event.target.nodeName == 'LI') {
          ColumnTypeMenu.setColumnType(col, event.target.data['colType'], cm, instance);
        }
      });
      TH.firstChild.appendChild(button);
      TH.style['white-space'] = 'normal';
    };
  },
  buildMenu(activeCellType) {
    const menu = document.createElement('UL');
    const types = ['text', 'numeric', 'date', 'checkbox'];
    let item;
    menu.className = 'changeTypeMenu';
    for (let i = 0; i < types.length; i++) {
      item = document.createElement('LI');
      if ('innerText' in item) {
        item.innerText = types[i];
      } else {
        item.textContent = types[i];
      }
      item.data = {colType: types[i]};
      if (activeCellType == types[i]) {
        item.className = 'active';
      }
      menu.appendChild(item);
    }
    return menu;
  },
  buildButton() {
    const button = document.createElement('BUTTON');
    button.innerHTML = '\u25BC';
    button.className = 'changeType';
    return button;
  },
  /*
   * Handling the click event on the header button in order to open the type menu.
   */
  addButtonMenuEvent(button, menu) {
    Handsontable.Dom.addEvent(button, 'click', function (event) {
      let changeTypeMenu;
      let position;
      let removeMenu;

      document.body.appendChild(menu);

      event.preventDefault();
      event.stopImmediatePropagation();

      changeTypeMenu = document.querySelectorAll('.changeTypeMenu');

      for (let i = 0; i < changeTypeMenu.length; i++) {
        changeTypeMenu[i].style.display = 'none';
      }
      menu.style.display = 'block';
      position = button.getBoundingClientRect();

      menu.style.top = `${position.top + (window.scrollY || window.pageYOffset) + 2}px`;
      menu.style.left = `${position.left}px`;

      removeMenu = function (event) {
        if (menu.parentNode) {
          menu.parentNode.removeChild(menu);
        }
      };
      Handsontable.Dom.removeEvent(document, 'click', removeMenu);
      Handsontable.Dom.addEvent(document, 'click', removeMenu);
    });
  },
  setColumnType(i, type, cm, instance) {
    cm.setColumnType(i, type);
    // TODO clear invalid style - <><><><>
    instance.validateCells(function () {
      instance.render();
    });
  },
};

// -----------------------------------------------------------------------------
// DataGrid Edit Mode
// -----------------------------------------------------------------------------

/*
 * We customize the context menu of handsontable here.
 */
const contextMenu = {
  items: {
    row_above: {},
    row_below: {},
    hsep1: '---------',
    col_left: {},
    col_right: {},
    hsep2: '---------',
    remove_row: {},
    remove_col: {},
    hsep3: '---------',
    undo: {},
    redo: {},
    hsep4: '---------',
    make_read_only: {},
    hsep5: '---------',
    alignment: {
      disabled() {
        return $(event.target).parents('.ht_clone_top').size() == 0;
      },
    },
    // 'hsep6' : '---------',
    // 'commentsAddEdit' : {},
    // 'commentsRemove' : {},
    // 'hsep7' : '---------',
    // 'freeze_column' : {},
  },
};

/*
 * Get the data from handsontable as a 2D array.
 */
var getHotData = function (hot, skipSpareRowCol) {
  // console.log('getHotData: ' + hot.countRows() + ' ____ ' + hot.countCols());
  const content = [];
  // note that last row is removed
  const hotRows = skipSpareRowCol ? hot.countRows() - 1 : hot.countRows();
  const hotCols = skipSpareRowCol ? hot.countCols() - 1 : hot.countCols();
  for (let row = 0; row < hotRows; row++) {
    const rowData = [];
    for (let col = 0; col < hotCols; col++) {
      rowData[col] = hot.getDataAtCell(row, col);
    }
    content[row] = rowData;
  }
  return content;
};

class DataGrid extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleSearchKeyUp = this.handleSearchKeyUp.bind(this);
    this.handleSearchOption = this.handleSearchOption.bind(this);
    this.handleshowHeaders = this.handleshowHeaders.bind(this);

    this.state = {
      showHeaders: props.content.config.showHeaders,
      searchOption: props.content.config.search,
      renderMode: props.content.config.renderMode,
    };
  }

  componentDidMount() {
    this.setupHandsontable(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.content.data == newProps.content.data
      && this.props.content.config == newProps.content.config
      && this.props.mode == newProps.mode) {
      return;
    }

    this.setState({
      searchOption: newProps.content.config.search,
      showHeaders: newProps.content.config.showHeaders,
    });

    if (newProps.mode == 'view') {
      if (this.handsontable) {
        this.handsontable.destroy();
      }
    }
    this.setupHandsontable(newProps);
  }

  handleSave() {
    const hot = this.handsontable;
    const data = getHotData(hot, true);
    // console.log('handleSave_Before: ' + this.props.content.data.length);
    const config = $.extend(
      this.columnModel.getConfig(),
      {
        showHeaders: this.state.showHeaders,
        search: this.state.searchOption,
        height: this.props.content.config.height,
      },
    );
    this.props.updateContentState({data, config});
    // console.log('handleSave_After: ' + this.props.content.data.length);
  }

  handleSearchKeyUp(event) {
    this.handsontable.search.query(event.target.value);
    this.handsontable.render();
  }

  handleSearchOption(event) {
    this.setState({
      searchOption: event.target.checked,
    });
    this.handsontable.updateSettings({
      search: event.target.checked,
    });
  }

  handleshowHeaders(event) {
    this.setState({
      showHeaders: event.target.checked,
    });
  }

  saveComponent() {
    this.handleSave();
  }

  setupHandsontable(props) {
    const container = findDOMNode(this.refs.gridContainer);
    const cm = new ColumnModel(props.content.config);
    const getCellProperties = function (row, col, prop) {
      const cellProps = {};
      // Set type to 'text' for first row
      cellProps.type = props.mode == 'edit' ?
        (row == 0 && props.content.config.showHeaders) ? 'text' : cm.getColumnType(col) :
        cm.getColumnType(col);
      cellProps.className = cm.getColumnAlignment(col);
      return cellProps;
    };

    const data = $.extend(true, [], props.content.data);
    var config = (// view config
    props.mode == 'view' ? // edit config
    {
      data: (props.content.config.showHeaders ? data.slice(1) : data),
      colHeaders: (props.content.config.showHeaders ? data[0] : false),
      colWidths: cm.getColWidths(),
      manualColumnResize: true,
      manualColumnMove: true,

      //manualColumnFreeze: true,
      columnSorting: true,

      sortIndicator: true,
      readOnly: true,
      fillHandle: false,
      minSpareRows: 0,
      search: props.content.config.search,
      cells: getCellProperties,
      height: props.content.config.height,
      contextMenu: false,
    } : {
      data,
      colWidths: cm.getColWidths(),
      manualColumnResize: true,
      manualColumnMove: true,

      //manualColumnFreeze: true,
      columnSorting: true,

      sortIndicator: true,
      colHeaders: true,
      rowHeaders: true,

      //comments: true,
      minSpareRows: 1,

      minSpareCols: 1,
      search: props.content.config.search,
      cells: getCellProperties,
      contextMenu,
      height: props.content.config.height,

      // hooks
      afterGetColHeader: ColumnTypeMenu.getAfterGetColHeader(cm),

      afterCreateCol: cm.getAfterCreateCol(),
      afterRemoveCol: cm.getAfterRemoveCol(),
      afterColumnMove: cm.getAfterColumnMove(),
      afterColumnResize: cm.getAfterColumnResize(),
      afterSetCellMeta: cm.getAfterSetCellMeta(),
    });

    this.handsontable = new Handsontable(container, config);
    this.columnModel = cm;
  }

  render() {
    const tools = [];
    if (this.state.searchOption) {
      tools.push(
        <div className='search-bar'>
          <Label>Search</Label>
          <Input onKeyUp={this.handleSearchKeyUp} width='200'/>
        </div>
      );
    }
    if (this.props.mode == 'view') {
      return (
        <div className='data-grid'>
          { tools }
          <div ref='gridContainer'></div>
        </div>
      );
    } else {
      return (
        <div className='data-grid'>
          { tools }
          <div ref='gridContainer'></div>
          <div>
            <Checkbox defaultChecked={this.state.searchOption} onChange={this.handleSearchOption}>Enable
              Search</Checkbox>
            <Checkbox defaultChecked={this.state.showHeaders} onChange={this.handleshowHeaders}>Show Headers</Checkbox>
          </div>
        </div>
      );
    }
  }
}

DataGrid.getComponentDefault = function () {
  const defaultContent = {
    version: '1.0',
    caption: '',

    data: [
      ['111', '2222', '3222'],
      ['4', '5', '6'],
      ['7', '8', '9333'],
    ],

    config: {
      search: true,
      height: 300,
      showHeaders: false,

      columns: [
        {type: 'text', width: 50, alignment: ''},
        {type: 'text', width: 50, alignment: ''},
        {type: 'text', width: 50, alignment: ''},
        {type: 'text', width: 50, alignment: ''},
        {type: 'text', width: 50, alignment: ''},
      ],
    },
  };
  return defaultContent;
};

module.exports = DataGrid;
