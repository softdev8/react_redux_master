import commonFormStyles from '../Form.module.scss';
import styles from './CheckoutForm.module.scss';

import React, { PropTypes, Component } from 'react';
import braintree from 'braintree-web';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import { ModalHeader } from '../../Modals';
import CheckoutFormInvoice from './CheckoutFormInvoice';
import TuitionAgenda from './TuitionAgenda';
import { Btn, InlineStatusControl } from '../../index';
import { updateTransactionInGA } from './updateGA';

// import { parseError } from '../../../utils/errorResponseUtils';

import { getBraintreeToken, postBraintreeBuyRequest,
         showModal, closeModal, setTransactionId, setUserTransactionId,
         resetAllPaymentData } from '../../../actions';
import { ModalTypes } from '../../../constants';

// import { checkError } from '../../../utils/errorResponseUtils';

const PaymentUnavailableMessage = 'Transaction declined. Please contact support@educative.io.';

@connect(({ payment, user, router }) => {
  return { payment, userInfo: user.info.data, router };
})
class CheckoutForm extends Component {

  constructor(props) {
    super(props);

    this.onReady         = this.onReady.bind(this);
    this.onNonceReceived = this.onNonceReceived.bind(this);
    this.onPaymentError  = this.onPaymentError.bind(this);
    this.onBuyAfterPriceBecomesZero = this.onBuyAfterPriceBecomesZero.bind(this);
    this.routeToLogin = this.routeToLogin.bind(this);
    this.onTuitionAgendaChange = this.onTuitionAgendaChange.bind(this);
    this.onTuitionGoogleHangoutChange = this.onTuitionGoogleHangoutChange.bind(this);
    this.onTuitionSkypeChange = this.onTuitionSkypeChange.bind(this);
    this.onTuitionTimezoneChange = this.onTuitionTimezoneChange.bind(this);

    this.state = {
      waitForBraintree : true,
      statusData       : { status: 'INIT', text:'' },
      tuition_offer_agenda : '',
      tuition_offer_google_hangout: '',
      tuition_offer_skype: '',
      tuition_offer_timezone: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    const nextWorkData      = nextProps.payment.get('workData');
    const nextTotalPrice    = nextProps.payment.get('total_price');
    const nextTransactionId = nextProps.payment.get('transaction_id');

    if (!nextWorkData) return;

    if (nextWorkData.price !== 0 && nextTotalPrice !== 0 && !nextTransactionId) {
      this.setState({
        waitForBraintree : true,
        statusData       : { status: 'WAIT', text:'Loading Payment Service' },
      });
      this.setupBraintree(nextWorkData);

    } else if (!nextTransactionId && this.state.statusData.status === 'INIT') {
      // If work price is $0 call buy API . This should only happen on modal load too
      const params = {
        author_id                    : nextWorkData.author_id,
        work_id                      : nextWorkData.work_id,
        tuition_offer_id             : nextWorkData.tuition_offer_id || null,
        tuition_offer_agenda         : this.state.tuition_offer_agenda,
        tuition_offer_skype          : this.state.tuition_offer_skype,
        tuition_offer_google_hangout : this.state.tuition_offer_google_hangout,
        tuition_offer_timezone       : this.state.tuition_offer_timezone,
        expected_price               : nextTotalPrice || 0.0,
      };
      this.postBuyRequest(params);
    }
  }

  onReady() {
    this.setState({
      waitForBraintree: false,
      statusData: { status: 'INIT', text:'' },
    });
  }

  onTuitionAgendaChange(e) {
    const value = e.target.value;

    this.setState({
      tuition_offer_agenda: value
    });
  }

  onTuitionGoogleHangoutChange(e) {
    const value = e.target.value;

    this.setState({
      tuition_offer_google_hangout: value
    });
  }

  onTuitionSkypeChange(e) {
    const value = e.target.value;

    this.setState({
      tuition_offer_skype: value
    });
  }

  onTuitionTimezoneChange(timezone) {
    this.setState({
      tuition_offer_timezone: timezone
    });
  }

  onNonceReceived(event, nonce) {
    const workData       = this.props.payment.get('workData');
    const coupon         = this.props.payment.get('coupon');
    const total_price    = this.props.payment.get('total_price');
    const transaction_id = this.props.payment.get('transaction_id');
    const user_transaction_id = this.props.payment.get('user_transaction_id');

    const params = {
      author_id                    : workData.author_id,
      work_id                      : workData.work_id,
      tuition_offer_id             : workData.tuition_offer_id || null,
      tuition_offer_agenda         : this.state.tuition_offer_agenda,
      tuition_offer_skype          : this.state.tuition_offer_skype,
      tuition_offer_google_hangout : this.state.tuition_offer_google_hangout,
      tuition_offer_timezone       : this.state.tuition_offer_timezone,
      transaction_id,
      user_transaction_id,
      expected_price               : total_price,
    };

    if (total_price !== 0) {
      params.payment_method_nonce = nonce;
    }

    if (coupon) {
      params.coupon_code = coupon.coupon_code;
    }

    this.postBuyRequest(params);
  }

  onPaymentError() {
    this.setState({
      statusData : { status:'ERROR', text:PaymentUnavailableMessage },
    });
  }

  onBuyAfterPriceBecomesZero() {

    const workData       = this.props.payment.get('workData');
    const total_price    = this.props.payment.get('total_price');
    const transaction_id = this.props.payment.get('transaction_id');
    const user_transaction_id = this.props.payment.get('user_transaction_id');
    const coupon         = this.props.payment.get('coupon');

    const params = {
      author_id                    : workData.author_id,
      work_id                      : workData.work_id,
      tuition_offer_id             : workData.tuition_offer_id || null,
      tuition_offer_agenda         : this.state.tuition_offer_agenda,
      tuition_offer_skype          : this.state.tuition_offer_skype,
      tuition_offer_google_hangout : this.state.tuition_offer_google_hangout,
      tuition_offer_timezone       : this.state.tuition_offer_timezone,

      expected_price   : total_price,
      transaction_id,
      user_transaction_id,
      coupon_code      : coupon.coupon_code,
    };

    this.postBuyRequest(params);
  }

  setupBraintree(workData) {
    // console.log('__________work_type', workData);
    const token_info = {
      transaction_type: workData.work_type === 'collection' || workData.work_type === 'page' ?
                          'work_sale' :
                          'work_tuition_sale',
      author_id_intent: workData.author_id || null,
      work_id_intent: workData.work_id || null,
      tuition_offer_id_intent: workData.tuition_offer_id || null,
    };

    getBraintreeToken(token_info).then(JSON.parse).catch((err) => {
      if (err.status === 401) {
        this.routeToLogin();
      }
      this.setState({ statusData : { status:'ERROR', text:PaymentUnavailableMessage } });
      return;
    }).then((object) => {
      braintree.setup(
        object.token,
        'dropin',
        {
          container                  : 'braintree-payment-form',
          paymentMethodNonceReceived : this.onNonceReceived,
          onReady                    : this.onReady,
          onError                    : this.onPaymentError,
        },
      );

      this.props.dispatch(setTransactionId(object.transaction_id));
      this.props.dispatch(setUserTransactionId(object.user_transaction_id));

    }).catch(() => {
      console.error('Braintree setup failed.');
      this.setState({ statusData : { status:'ERROR', text:PaymentUnavailableMessage } });
    });
  }

  routeToLogin() {
    // indicates a redirection is already in progress
    if (this.props.router.location && this.props.router.location.query.ru) {
      return;
    }

    let returnUrl = null;
    if (this.props.router.location) {
      // TBD: Handle query params too in this routing
      returnUrl = this.props.router.location.pathname;
      this.props.dispatch(closeModal());
      this.props.dispatch(pushState({ forceTransition: true }, '/login', { ru: returnUrl }));
      return;
    }
  }

  postBuyRequest(params = {}) {
    this.setState({
      statusData : { status:'WAIT', text:'Processing' },
    }, () => {

      postBraintreeBuyRequest(params).then(() => {
        const workData   = this.props.payment.get('workData');
        const urlToWorkPage = this.props.payment.get('workData').redirect_url ?
            this.props.payment.get('workData').redirect_url : `/${workData.work_type}/${workData.author_id}/${workData.work_id}`;

        this.setState({ statusData : { status:'SUCCESS', text:'Transaction Completed' } });

        updateTransactionInGA(workData, params.expected_price, params.user_transaction_id);

        this.props.dispatch(pushState(null, urlToWorkPage));
        this.props.dispatch(resetAllPaymentData());
        this.props.dispatch(closeModal());

      }).catch(error => {
        const result = this.parseBuyingError(error);
        this.setState({ statusData : { status:'ERROR', text:result } });
      });
    });
  }

  parseBuyingError(error) {
    if (error.status === 401) {
      this.routeToLogin();
    } else if (error.status >= 400 && error.status < 500) {
      return `Transaction failed. Contact support@educative.io. Error: ${error.responseText}`;
    } else if (error.status >= 500 && error.status < 600) {
      return PaymentUnavailableMessage;
    }
  }

  renderByBraintree() {
    return (
      <div className={styles.braintree} key="braintree">
        <a href="https://www.braintreegateway.com/merchants/YOUR_MERCHANT_ID/verified" target="_blank">
          <img src="https://s3.amazonaws.com/braintree-badges/braintree-badge-wide-light.png" width="180px" height ="29px" border="0"/>
        </a>
       </div>
      );
  }

  renderFormAgreementText() {
    return (
      <span className={styles.terms}>
        By clicking the "Buy" button you agree to our&nbsp;
        <span className={styles['modal-link']} onClick={() => this.props.dispatch(showModal(ModalTypes.TOS))} style={{ cursor:'hand', cursor:'pointer' }}>
          Terms of Service
        </span>.
        If you are not satisfied&nbsp;
        <span className={styles['modal-link']} onClick={()=>this.props.dispatch(showModal(ModalTypes.RETURN))} style={{ cursor:'hand', cursor:'pointer' }}>returns</span>
        &nbsp;are easy.
      </span>
    );

  }

  renderProcessing() {
    return <div className={styles.processing}>Processing...</div>;
  }

  render() {

    const workData = this.props.payment.get('workData');
    const coupon   = this.props.payment.get('coupon');
    const { waitForBraintree } = this.state;

    if (!workData) return null;

    const showProcessing = workData.price === 0;
    const hideForm = coupon && coupon.price_with_coupon === 0;

    let childForm;
    if (!showProcessing) {
      if (!hideForm) {
        childForm = (
          <div key="BT-FORM">
            <form action="/transactions" className={styles.card} method="GET">
              <div id="braintree-payment-form"/>
              <div className={styles.buttons}>
                <input className="b-btn b-btn_primary" type="submit" value="Buy" />
                <p className={commonFormStyles['form-hint']}>{ this.renderFormAgreementText() }</p>
              </div>
            </form>
          </div>
        );
      } else {
        childForm = (
          <div key="NO-FORM">
            <form className={styles.card}>
              <div className={styles.buttons}>
                <Btn className={styles.getButton} primary onClick={this.onBuyAfterPriceBecomesZero}>Get</Btn>
                <p className={commonFormStyles['form-hint']}>{ this.renderFormAgreementText() }</p>
              </div>
            </form>
          </div>
        );
      }
    } else {
      childForm = this.renderProcessing();
    }


    const placeholderActiveClass = waitForBraintree ? styles['placeholder-active'] : '';

    const body = (
      <div className={`${commonFormStyles.body} ${styles.body}`}>
        <div className={`${commonFormStyles.column} ${styles.column}`}>

          {
            workData.work_type === 'work_tuition_sale' &&
            <TuitionAgenda
              tuition_offer_agenda={this.state.tuition_offer_agenda}
              tuition_offer_skype={this.state.tuition_offer_skype}
              tuition_offer_google_hangout={this.state.tuition_offer_google_hangout}
              tuition_offer_timezone={this.state.tuition_offer_timezone}
              onTuitionAgendaChange={this.onTuitionAgendaChange}
              onTuitionGoogleHangoutChange={this.onTuitionGoogleHangoutChange}
              onTuitionSkypeChange={this.onTuitionSkypeChange}
              onTuitionTimezoneChange={this.onTuitionTimezoneChange}
            />
          }

          <CheckoutFormInvoice/>

          { this.renderByBraintree() }

          { childForm }

          <div className={`${styles.placeholder} ${placeholderActiveClass}`}></div>

        </div>

      </div>
    );


    return (
      <div className={`${styles.checkout} ${commonFormStyles.form}`}>

        <ModalHeader title="Almost there ..."/>

        <InlineStatusControl statusData={this.state.statusData}/>
        { body }

      </div>
    );
  }
}

CheckoutForm.propTypes = {
  payment  : PropTypes.object.isRequired,
  dispatch : PropTypes.func.isRequired,
  router : PropTypes.object.isRequired,
};

export default CheckoutForm;
