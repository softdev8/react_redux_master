import styles from './SubscribeWidget.module.scss';

import React, { Component, PropTypes } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { connect } from 'react-redux';

import { ModalTypes } from '../../constants';
import { showModal } from '../../actions';
import { Btn, Icons, SomethingWithIcon } from '../';
import { subscribeCourse, unsubscribeCourse } from '../../actions';

@connect(({ router : { location } }) => {
  return { location };
})
class SubscribeWidget extends Component {
  constructor(props, context) {
    super(props, context);

    this.buttonClicked = this.buttonClicked.bind(this);

    this.state = {
      subscribed : this.props.subscribed
    };
  }

  buttonClicked() {
    // only note down subscriptions if the user is logged in and there is a valid user id
    if (this.props.userId) {
      const action = this.state.subscribed ?  unsubscribeCourse : subscribeCourse;
      action({
        authorId: this.props.authorId,
        collectionId: this.props.collectionId
      }).then((res) => {
        this.setState({
          subscribed: !this.state.subscribed
        });
      }).catch((error) => {
        console.log(error);
      });
    } else {
      this.props.dispatch(showModal(ModalTypes.LOGIN, { ru: this.props.location.pathname }));
    }
  }

  createTooltipObject(tooltip_string) {
    return <Tooltip>{ tooltip_string }</Tooltip>;
  }

  render() {

    const tooltipMessage = this.state.subscribed ? 'Unsubscribe from updates for this course' : 'Subscribe to get updates for this course';
    const submitButton = (
      <OverlayTrigger placement="top" overlay={this.createTooltipObject(tooltipMessage)}>
        <Btn type="button" className={ this.state.subscribed ? styles.heartButtonUnsub : styles.heartButtonSub } onClick={this.buttonClicked}>
          <SomethingWithIcon
            icon={ Icons.subscribeIcon }
          />
        { this.state.subscribed ? 'Unsubscribe' : 'Subscribe' }
        </Btn>
      </OverlayTrigger>
      );

    return (
      <div className={styles.recommendation}>
        {submitButton}
      </div>
    );

  }

}

SubscribeWidget.propTypes = {
  subscribed         : PropTypes.bool,
  userId             : PropTypes.number,
  authorId           : PropTypes.string,
  collectionId       : PropTypes.string
};

export default SubscribeWidget;
