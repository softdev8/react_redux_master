import React from "react";

import {FormControl} from 'react-bootstrap';
import {SomethingWithIcon, Icons} from './index';

const Button = require('./common/Button');

export default (props)=>{

    let compAlign = 'center'

    return (
        <div>
            <div className='edcomp-toolbar'>
                <div style={{padding:1}}>
                <Button style={{marginLeft:15, float:'right'}} sm outlined bsStyle='darkgreen45'
                        onClick={props.onModify}>
                    <SomethingWithIcon icon={Icons.paintBrushIcon}/>
                    Modify
                </Button>
                </div>
            </div>
            <div style={{textAlign:compAlign}}>
                <div >
                    {props.children}
                </div>
            </div>
          </div>
    );
}