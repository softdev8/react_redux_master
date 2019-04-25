import styles from './TuitionAgenda.module.scss';

import React, { PropTypes, Component } from 'react';
import Textarea from 'react-textarea-autosize';
import ReactTimezone from 'react-timezone';

export default class TuitionAgenda extends Component {

  render() {
    return (
      <div className={styles.tuition_agenda_container}>
        <label className={styles.tuition_agenda_label}>
          Tell us what you're looking for in this session.
        </label>
        <Textarea
          className={styles.tuition_agenda}
          maxLength={1024}
          minRows={2}
          maxRows={2}
          value={this.props.tuition_offer_agenda}
          onChange={this.props.onTuitionAgendaChange}
        />
        <label className={styles.tuition_agenda_label}>
          <i className="fa fa-google" style={{ marginRight:5, color:'#ea4335' }} />
          Google Hangout
        </label>
        <Textarea
          className={styles.tuition_agenda}
          maxLength={100}
          minRows={1}
          maxRows={1}
          value={this.props.tuition_offer_google_hangout}
          onChange={this.props.onTuitionGoogleHangoutChange}
        />
        <label className={styles.tuition_agenda_label}>
          <i className="fa fa-skype" style={{ marginRight:5, color:'#00aff0' }} />
          Skype
        </label>
        <Textarea
          className={styles.tuition_agenda}
          maxLength={100}
          minRows={1}
          maxRows={1}
          value={this.props.tuition_offer_skype}
          onChange={this.props.onTuitionSkypeChange}
        />
        <label className={styles.tuition_agenda_label}>
          <i className="fa fa-clock-o" style={{ marginRight:5 }} />
          What's your timezone?
        </label>
        <ReactTimezone
          value={this.props.tuition_offer_timezone}
          onChange={this.props.onTuitionTimezoneChange}
          style={{ width:'100%' }}
        />
      </div>
    );
  }
}

TuitionAgenda.propTypes = {
  tuition_offer_agenda         : PropTypes.string.isRequired,
  tuition_offer_google_hangout : PropTypes.string.isRequired,
  tuition_offer_skype          : PropTypes.string.isRequired,
  tuition_offer_timezone       : PropTypes.string.isRequired,
  onTuitionAgendaChange        : PropTypes.func.isRequired,
  onTuitionGoogleHangoutChange : PropTypes.func.isRequired,
  onTuitionSkypeChange         : PropTypes.func.isRequired,
  onTuitionTimezoneChange      : PropTypes.func.isRequired,
};
