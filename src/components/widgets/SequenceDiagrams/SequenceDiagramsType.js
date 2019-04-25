import styles from './SequenceDiagrams.module.scss'
import React from 'react'
import {DropdownButton, MenuItem} from 'react-bootstrap';

class SequenceDiagramsType extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            diagram_type: props.diagram_type
        }
        this.handleDiagramType = this.handleDiagramType.bind(this)
    }

    handleDiagramType(e) {
        this.setState({
            diagram_type: e
        })
        this.props.handleDiagramType(e);
    }

    getDiagramTitle(type) {
        const diagram_types = this.props.diagram_types
        for(let i = 0; i < diagram_types.length; i++) {
        if (diagram_types[i].type == type)
            return diagram_types[i].title;
        }
    }

    render() {
        
        const diagramDropDownTitle = this.getDiagramTitle(this.state.diagram_type)
        const diagramMenuItems = this.props.diagram_types.map((diagram_type, key) => {
        if (this.state.diagram_type == diagram_type.type)
            return <MenuItem eventKey={diagram_type.type} key={key} active>{diagram_type.title}</MenuItem>
        else 
            return <MenuItem eventKey={diagram_type.type} key={key}>{diagram_type.title}</MenuItem>  
        })
        const diagramType = (
        <DropdownButton 
            bsSize="xsmall" 
            className={styles.diagram_drondown_button}
            onSelect={this.handleDiagramType} 
            title={diagramDropDownTitle} 
            id="dropdown-size-extra-small">
                {diagramMenuItems}
        </DropdownButton>
        )
        return (
            <div className={styles.diagram_type_area}>
                    <span className={styles.diagram_dropdown_label}> Sequence Diagram Type: </span>
                    {diagramType}
            </div> 
        )
    }
}

export default SequenceDiagramsType