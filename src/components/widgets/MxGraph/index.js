import React, {Component, PropTypes} from "react";

import GraphEditor from "./grapheditor";

import SvgViewer from "../../SvgViewer";
import ModifyContainer from "../../ModifyContainer";
import ModalContainer from "../../ModalContainer";

const ModalManager = require('../../common/ModalManager');
const CaptionComponent = require('../../CaptionComponent/CaptionComponent');

class MxGraph extends Component {

    constructor(props) {
        super(props);

        this.state = {...this.props.content};

        this.handleModify = this.handleModify.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleCaptionChange = this.handleCaptionChange.bind(this);
    }

    saveComponent() {
        this.props.updateContentState({...this.state});
    }

    inEditMode() {
        return this.props.mode === "edit";
    }

    handleModify(){

        const xml = this.state.xml;

        ModalManager.create.call(this, ModalContainer(GraphEditor, {onUpdate: this.handleUpdate, content: xml}));
    }

    handleUpdate(data){
        this.setState(data);
    }

    handleCaptionChange(caption){
        this.setState({caption});
    }

    render() {
        if (this.inEditMode()) 
            return (<ModifyContainer onModify={this.handleModify}>
                    <SvgViewer content={this.state.svg} />
                    <CaptionComponent caption={this.state.caption}
                        readOnly={false} onCaptionChange={this.handleCaptionChange}/>
                </ModifyContainer>);
        
        return (
            <div>
                <SvgViewer content={this.state.svg} />
                <CaptionComponent caption={this.state.caption} readOnly={true}/>
            </div>);
    }

}


MxGraph.getComponentDefault = () => ({
    xml: '<mxGraphModel><root></root></mxGraphModel>',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100px" height="100px" version="1.1"></svg>',
    caption: ''
});

export default MxGraph;