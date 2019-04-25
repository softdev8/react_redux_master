import React, {Component, PropTypes} from "react";

import channel from "./channel";

const propTypes = {
    content: PropTypes.string.isRequired
}

class GraphEditor extends Component{

    constructor(props){
        super(props);

        this.handleUpdate = this.handleUpdate.bind(this);

        if(window.DEBUG){
            this.graphEditorPath = "http://localhost:4444/static/dist/js/grapheditor/index.html";
        }else{
            this.graphEditorPath = "/grapheditor/index.html";
        }
    }

    componentWillReceiveProps(nextProps){
        this.updateIframe(nextProps.content);
    }

    updateIframe(text){
        if(this.text === text || !text) return;
        this.text = text;
        this.channel.send(text);
    }

    handleUpdate(event){
        this.text = event.data.xml;
        if(this.props.onUpdate){
            this.props.onUpdate(event.data);
        }
    }

    componentWillUpdate(){
        return false;
    }

    componentDidMount(){
        this.channel = channel(this.refs.iframe);
        this.channel.subscribe(this.handleUpdate);

        if (this.refs.iframe.attachEvent) {
            this.refs.iframe.attachEvent('onload', this.initIFrame.bind(this));
        } else {
            this.refs.iframe.onload = this.initIFrame.bind(this);
        }

    }

    componentWillUnmount(){
        this.channel.unsubscribe(this.handleUpdate);
    }

    initIFrame(){
        var that = this;
        setTimeout(function(){
            that.updateIframe(that.props.content);
        }, 500);
    }

    render(){
        return (
            <div style={{height:'100%', width: '100%'}}>
                <iframe ref="iframe" src={this.graphEditorPath} width="100%" height="100%" />
            </div>
        );
    }
}


GraphEditor.PropTypes = propTypes;

export default GraphEditor;