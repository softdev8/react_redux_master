import generateId from '../../utils/generateId';

export default class Category {

  constructor(is_default = false, mode = true) {
    this.id    = generateId();
    this.title = is_default ? '__default' : '';
    this.pages = [];
    this.editMode = mode;
  }
}