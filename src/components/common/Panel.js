import React from 'react'
import pure from 'react-pure-component'

export default pure((props)=>{
    let panelClasses = 'rubix-panel';
    if(props.horizontal)
      panelClasses += ' horizontal';

    var props = {
      ...props,
      ...{
        ref: 'panel',
        className: [props.className, panelClasses].join(' '),
      },
    };

    return (
      <div {...props}>
        <div>{props.children}</div>
      </div>
    );
})

 // propTypes: {
 //    horizontal: React.PropTypes.bool
 //  },
