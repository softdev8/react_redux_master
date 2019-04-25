import React, {Component, PropTypes} from 'react';
import {Col, FormGroup,ControlLabel, DropdownButton, MenuItem} from 'react-bootstrap';
import { CodeMirrorThemes } from '../../helpers/codeoptions';

export default class DropDown extends Component {

    static PropTypes = {
        types_theme: PropTypes.array,
        type: PropTypes.string,
        onChangeTheme: PropTypes.func,
        selectedCodeTheme: PropTypes.string
    };

    static defaultProps =  {
        selectedCodeTheme: "default"
    };

    constructor(props, context) {
        super(props, context);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.props.onChangeTheme(this.props.type, e);
    };

    render() {
        const option_list = this.props.types_theme.map((value, key) => {
            const themeTitle = CodeMirrorThemes[value];

            if (this.props.selectedCodeTheme == value)
               return <MenuItem eventKey={value}  active>{themeTitle}</MenuItem>;
            else
               return <MenuItem eventKey={value}>{themeTitle}</MenuItem>;
        });

        return (

            <FormGroup controlId={this.props.type}>
                <Col componentClass={ControlLabel} sm={2}>
                    {this.props.type}
                </Col>
                <Col sm={10}>
                    <DropdownButton title={this.props.selectedCodeTheme} bsStyle="default"  onSelect={this.onChange}>
                        {option_list}
                    </DropdownButton>
                </Col>
            </FormGroup>

        )
    };
}
