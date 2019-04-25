import React from 'react';

export default function (categoryObject, categoryNode, searchString, page_titles) {
  if (!categoryObject.editMode && categoryObject.title !== '__default') {
    const untitledArticle = 'Untitled Masterpiece';
    let pages;

    // if category title matched return category as is
    if (categoryObject.title.toLowerCase().indexOf(searchString) !== -1) {
      // don't search through pages
      return React.cloneElement(categoryNode, { searchString : '' });
    }

    // else filter pages
    pages = categoryObject.pages.filter(page => {

      // if article don't titled yet, mathc over default title
      if (page_titles[page.id] === '') {
        return untitledArticle.toLowerCase().indexOf(searchString) !== -1;
      }

      if (page_titles[page.id] !== null) {
        return page_titles[page.id].toLowerCase().indexOf(searchString) !== -1;
      }

      return page.title.toLowerCase().indexOf(searchString) !== -1;
    });

    // if cat.title not matched and hasn't mathed pages (but may has)
    if (pages.length) return categoryNode;
    return null;
  }

  return categoryNode;
}
