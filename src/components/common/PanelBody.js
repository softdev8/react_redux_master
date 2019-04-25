import React from 'react'

export default (props)=>{
   var props = {
     ...props,
     ...{
       className: [props.className, 'rubix-panel-body'].join(' '),
     },
   };

    return (
      <div style={{zIndex:9999992}} {...props} >
        <div className="container-fluid rubix-grid">
          {props.children}
        </div>
      </div>
    );
}
