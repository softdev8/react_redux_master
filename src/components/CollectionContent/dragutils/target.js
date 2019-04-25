import {findDOMNode} from 'react-dom';

export const categoryTarget = {
  hover : overCategoryHover,
}

export const articleTarget = {
  hover : overArticleHover,
}

function overArticleHover(props, monitor, component) {
  const dragIndex   = monitor.getItem().index;
  const hoverIndex  = props.index;
  const dragType    = monitor.getItemType();
  const hoverType   = props.type;
  const hoverParentIndex = props.parentIndex;
  const dragParentIndex  = monitor.getItem().parentIndex;

  // hover article over article inside same category
  if (hoverParentIndex == dragParentIndex) {
    // Don't replace items with themselves

    if (!needMove(component, monitor, dragIndex, hoverIndex)) return;

    const from = {parentIndex: hoverParentIndex, itemIndex: dragIndex};
    const to = {parentIndex: hoverParentIndex, itemIndex: hoverIndex};

    // Time to actually perform the action
    props.moveItem(from, to);

    // mutating monitor item;
    monitor.getItem().index = hoverIndex;
  } else {
    if (!needMove(component, monitor, dragIndex, hoverIndex, false)) return;

    const from = {parentIndex: dragParentIndex, itemIndex: dragIndex};
    const to   = {parentIndex: hoverParentIndex, itemIndex: hoverIndex};

    props.moveItem(from, to);

    // mutating monitor item;
    monitor.getItem().index = hoverIndex;
    monitor.getItem().parentIndex = hoverParentIndex;
  }

}

function overCategoryHover(props, monitor, component) {
  const dragIndex   = monitor.getItem().index;
  const hoverIndex  = props.index;
  const parentIndex = monitor.getItem().parentIndex;
  const dragType    = monitor.getItemType();
  const hoverType   = props.type;

  // if hover category over category
  if (dragType == hoverType) {

    if (!needMove(component, monitor, dragIndex, hoverIndex)) return;

    // Time to actually perform the action
    props.moveItem({itemIndex: dragIndex}, {itemIndex: hoverIndex});

    // mutating monitor item;
    monitor.getItem().index = hoverIndex;
  }

  // moving something over another category (something.parentIndex !== category.index)
  // i.e. move article from one category over another category
  if (typeof parentIndex !== 'undefined' && parentIndex !== hoverIndex) {
    // move item to the category

    // but check if it has their own articles
    if (!props.data.pages.length) {
      let from = {parentIndex, itemIndex: dragIndex};
      let to = {parentIndex: hoverIndex};

      props.moveItem(from, to);

      // mutating monitor item
      // because it first element in category set index to 0;
      monitor.getItem().index = 0;
      monitor.getItem().parentIndex = to.parentIndex;
    }
  }

}

function needMove(component, monitor, dragIndex, hoverIndex, checkItself = true) {

  // Don't replace items with themselves
  if (checkItself && dragIndex === hoverIndex) {
    return false;
  }

  // Determine rectangle on screen
  const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

  // Get vertical third
  const topThird = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 3;
  const bottomThird = (hoverBoundingRect.bottom - hoverBoundingRect.top) - topThird;

  // Determine mouse position
  const clientOffset = monitor.getClientOffset();

  // Get pixels to the top
  const hoverClientY = clientOffset.y - hoverBoundingRect.top;

  // Only perform the move when the mouse has crossed half of the items height
  // When dragging downwards, only move when the cursor is below 50%
  // When dragging upwards, only move when the cursor is above 50%

  // Dragging downwards
  if (dragIndex < hoverIndex && hoverClientY < bottomThird) {
    return false;
  }

  // Dragging upwards
  if (dragIndex > hoverIndex && hoverClientY > topThird) {
    return false;
  }


  return true;
}