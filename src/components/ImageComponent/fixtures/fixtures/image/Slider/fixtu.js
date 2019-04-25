import React, {Component} from 'react'
import {go} from '../../../fixtures-share'

export default {
  slidesToShow: 3,
  children:[
    <img style={{width:100, height:100}} src={go}/>,
    <img style={{width:100, height:100}} src={go}/>,
    <div>1</div>,
    <img style={{width:100, height:100}} src={go}/>
  ]
};