import React from 'react'
import pure from 'react-pure-component';

import ImageOnSteroids from '../image/ImageOnSteroids'
import ArrowComponent from '../ArrowComponent'
import View from 'react-flexbox';

export default pure(({children, onLeftClick, onRightClick, style}) => {
    return <View auto row style={style || {height:'100%'}}>
      <View auto column style={{justifyContent: 'center'}} onClick={onLeftClick}>
        <ArrowComponent dir='left' color='black'/>
      </View>
      <View column style={{justifyContent: 'center', flexBasis: 0}}>
        {children}
      </View>
      <View auto column style={{justifyContent:'center'}} onClick={onRightClick}>
        <ArrowComponent dir='right' color='black'/>
      </View>
    </View>
  }
);
