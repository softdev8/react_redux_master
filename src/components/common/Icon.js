import React from 'react'
import pure from 'react-pure-component'
import classnames from 'classnames';

export default pure((props)=>{
   const classesObj = {
     'rubix-icon': true,
     'form-control-feedback': props.feedback || false,
   };
    if(props.bundle) {
      classesObj[props.bundle] = true;
      classesObj[`icon-${props.bundle}-${props.glyph}`] = true;
    } else {
      classesObj[props.glyph] = true;
    }

    const classes = classnames(classesObj);

    var props = {
      className: [props.className, classes.trim()].join(' '),
    };

    return (
      <span {...props}></span>
    );
})

 // propTypes: {
 //    feedback: React.PropTypes.bool,
 //    bundle: React.PropTypes.string,
 //    glyph: React.PropTypes.string.isRequired
 //  },
