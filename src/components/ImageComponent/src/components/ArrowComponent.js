import React from 'react';
import pure from 'react-pure-component';

export default pure(({dir, color}) => {
    let d;
    if (dir === 'left') {
      d = "M15.41 16.09l-4.58-4.59 4.58-4.59-1.41-1.41-6 6 6 6z";
    } else {
      d = "M8.59 16.34l4.58-4.59-4.58-4.59 1.41-1.41 6 6-6 6z";
    }
    return <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"
                style={{cursor:'hand',fill:color,width:'2.3rem',height:'2.3rem'}}>
      <g >
        <path d={d}></path>
      </g>
    </svg>
  }
);