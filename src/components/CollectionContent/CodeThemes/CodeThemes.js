import styles from './CodeThemes.module.scss';

import React, { Component, PropTypes } from 'react';
import { ModalTypes } from '../../../constants';
import { connect } from 'react-redux';
import { DropDown } from '../../index'
import { Form } from 'react-bootstrap';
import { CodeMirrorThemes } from '../../helpers/codeoptions';

@connect()
export default class CodeThemes extends Component {

    static propTypes = {
        selectedCodeThemes: PropTypes.object.isRequired,
        onChangeThemes: PropTypes.func,
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            type: ['Code', 'Markdown', 'RunJS', 'SPA']
        }
    }


    render() {
        const types_theme = Object.keys(CodeMirrorThemes);

        const dropdown_type = this.state.type.map((value, key) => {
            var selectedCodeTheme;
            if (value ==  "Code") {
                selectedCodeTheme = this.props.selectedCodeThemes.Code;
            } else if (value == "Markdown") {
                selectedCodeTheme = this.props.selectedCodeThemes.Markdown;
            } else if (value == "RunJS") {
                selectedCodeTheme = this.props.selectedCodeThemes.RunJS;
            } else if (value == "SPA") {
                selectedCodeTheme = this.props.selectedCodeThemes.SPA;
            }

            return <DropDown type={value} selectedCodeTheme = {selectedCodeTheme} key = {key} onChangeTheme = {this.props.onChangeThemes} types_theme={types_theme}/>
        });
        return (

            <div className={styles.code_exec_res_file_container}>
                <div className={styles.label}>Code Themes</div>
                <Form horizontal>
                {dropdown_type}
                </Form>

            </div>
        );
    }
}
