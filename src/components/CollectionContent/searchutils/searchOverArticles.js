export default function(searchString, pageObject, article_title) {  
  if(article_title){
    if(article_title.toLowerCase().indexOf(searchString) === -1) {
       return false;
    }
  } else if(pageObject.title.toLowerCase().indexOf(searchString) === -1) {
      return false;
  }

  return true;
}