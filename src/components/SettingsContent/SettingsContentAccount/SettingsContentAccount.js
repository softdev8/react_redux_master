import styles from './SettingsContentAccount.module.scss';

import React, {PropTypes, Component} from 'react';
import {Row, Col, Input} from 'react-bootstrap';

import {Icons, Btn} from '../../';

import StringEditor from './StringEditor';
import PasswordEditor from '../PasswordEditor/PasswordEditor';

const confirmation = 'We are sorry to see you go... Click Yes to confirm';

export default class SettingsContentAccount extends Component {

  static PropTypes = {
    data           : PropTypes.object.isRequired,
    updateUsername : PropTypes.func.isRequired,
    updatePassword : PropTypes.func.isRequired,
    deleteAccount  : PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onSaveUsername = this.onSaveUsername.bind(this);
    this.onEditorToggle = this.onEditorToggle.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);

    this.state = {
      showEditor : false,
    }
  }

  render() {
    const {data = {}}  = this.props;
    const {showEditor} = this.state;

    const userNameNode = [
      <span className={styles.value}>{data.user_name}</span>,
      <i className={styles['icon-wrap']} onClick={this.onEditorToggle}>
        { Icons.pencilIcon }
      </i>,
    ];

    return <div className={styles.account}>

            <div className='form-group'>
              <label className='control-label col-xs-4 col-md-2'>User Name:</label>
              <Col xs={8} md={4}>
              { showEditor ? 
                  <StringEditor placeholder='Change Your Username'
                                saveString={this.onSaveUsername}
                                string={data.user_name}/>
                  : userNameNode }
              </Col>
            </div>

            <div className='form-group'>
              <label className='control-label col-xs-4 col-md-2'>Email:</label>
              <Col xs={8} md={4}>
                <span className={styles.value}>{ data.email }</span>
              </Col>
            </div>

            <div className='form-group'>
              <label className='control-label col-xs-4 col-md-2'>Password:</label>
              <Col xs={8} md={4}>
                <PasswordEditor updatePassword={this.props.updatePassword}/>
              </Col>
            </div>

            {/*<div className={styles.delete}>
                          <Btn primary text='delete account' onClick={this.handleDeleteClick}/>
                        </div>*/}

           </div>;
  }

  onSaveUsername(string) {
    let data = {};

    data.user_name = string;

    this.setState({
      showEditor : false,
    }, () => {
      if(string != this.props.data.user_name) {
        this.props.updateUsername(data);
      }
    });
  }

  onEditorToggle() {

    this.setState({
      showEditor : !this.state.showEditor,
    });
  }

  handleDeleteClick(e) {
    if(window.confirm(confirmation)) {
      this.props.deleteAccount();
    }
  }
}