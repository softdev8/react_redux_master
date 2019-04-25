import dateFormatter from './formatDate';

export default function(dateString){
  //dateString = "Wed Jun 21 2015 16:02:51 GMT-0800 (PST)";
  const oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  const currentDate = new Date();
  const originalDate = new Date(dateString);

  let diffDays = Math.abs((currentDate.getTime() - originalDate.getTime())/(oneDay));
  
  if(diffDays < 1){
    return 'Today';
  }
  
  diffDays = Math.floor(diffDays);

  if(diffDays <= 31){
    if(diffDays <= 1){
      return "1 day ago";
    } else {
      return `${diffDays} days ago`;
    }
  }

  return dateFormatter(dateString, 'DD MMM YYYY');
}