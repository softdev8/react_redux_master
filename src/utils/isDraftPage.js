export default function(location) {
  const path = location.pathname.split('/');
  if(path){
    if(path[path.length-1] == 'draft'){
      return true;
    }
  }
  return false;
}