import React from "react";

export default (props)=>{

    const compAlign = "center";

    return (<div style={{textAlign:compAlign}}>
            <img src={`data:image/svg+xml;base64,${new Buffer(props.content).toString('base64')}`} />
          </div>);
}