import styles from './SettingsContent.module.scss';

import React, {PropTypes, Component} from 'react';

import Account from './SettingsContentAccount/SettingsContentAccount';
import Email from './SettingsContentEmail/SettingsContentEmail';
import Payment from './SettingsContentPayment/SettingsContentPayment';

export default class SettingsContent extends Component {

  static PropTypes = {
    payment        : PropTypes.array.isRequired,
    user           : PropTypes.object.isRequired,
    updateUsername : PropTypes.func.isRequired,
    updatePassword : PropTypes.func.isRequired,
    updatePayment  : PropTypes.func.isRequired,
    deleteAccount  : PropTypes.func.isRequired,
    updateNotifications : PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {

    const {user = {}, payment = {}} = this.props;

    const accountData = {
      user_name : user.user_name,
      email     : user.email,
    }

    const notificationData = {
      on : false,
    }
    
    return <div className={styles.settings}>

            { this.props.children }

            <section className={styles.set}>
              <h4 className={`${styles.title} col-md-offset-2`}>Account</h4>
              <Account data={accountData}
                       updateUsername={this.props.updateUsername}
                       updatePassword={this.props.updatePassword}
                       deleteAccount={this.props.deleteAccount}/>
            </section>

            {/*<section className={styles.set}>
                          <h4 className={`${styles.title} col-md-offset-2`}>Email</h4>
                          <Email updateNotifications={this.props.updateNotifications}
                                 data={notificationData}/>
                        </section>*/}

            {/*<section className={styles.set}>
                          <h4 className={`${styles.title} col-md-offset-2`}>Payment</h4>
                          <Payment updatePayment={this.props.updatePayment}
                                   data={payment}/>
                        </section>*/}

           </div>;
  }
}