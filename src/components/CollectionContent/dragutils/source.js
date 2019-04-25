export const articleSource = {
  beginDrag,
  canDrag,
}

export const categorySource = {
  beginDrag,
  canDrag,
}

function canDrag(props, monitor) {
  return props.mode == 'write';
}

function beginDrag(props) {
  return {
    parentIndex : props.parentIndex,
    index : props.index,
  };
}