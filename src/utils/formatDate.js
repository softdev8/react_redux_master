const fullMonthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const shortMonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const dayNames = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

//  TODO -- format time
export default function(dateString, format) {
  const origDate = new Date(dateString);
  const separator = format.match(/[^A-Za-z0-9]/gi)[0];

  let nodes = format.split(separator);

  nodes.forEach( (node, i) => {
    nodes[i] = formatNode(node, origDate);
  });

  return nodes.join(separator);
}

function formatNode(format, date) {
  const formatLength = format.length;
  const charCode = format[0].charCodeAt();

  if(charCode == 100 || charCode == 68) { // d or D
    if(formatLength < 3) return date.getDate(); // 01 or 15 etc.
    if(formatLength >= 3) return dayNames[date.getDay()-1]; // day name
  }

  if(charCode == 109 || charCode == 77) { // m or M
    if(formatLength < 3) return date.getMonth() + 1; // month number
    if(formatLength == 3) return shortMonthNames[date.getMonth()]; // short month name
    if(formatLength >= 4) return fullMonthNames[date.getMonth()]; // full month name
  }

  if(charCode == 121 || charCode == 89) { // y or Y
    if(formatLength == 2) return date.getFullYear().toString().substring(4, 2); // return 15 in 2015
    if(formatLength == 4) return date.getFullYear(); // full year
  }
}


function getNodeType(charCode) {

}