export default class Article {

  constructor(id, title) {
    this.id          = id;
    this.title       = title;
    this.is_preview  = false;
    this.parentIndex = null;
  }
}