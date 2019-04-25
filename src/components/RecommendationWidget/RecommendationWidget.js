import styles from './RecommendationWidget.module.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { ModalTypes } from '../../constants';
import { showModal } from '../../actions';

import { Btn, Icons, SomethingWithIcon } from '../';

import { recommend, unrecommend } from '../../actions';

@connect(({ router : { location } }) => {
  return { location };
})
class RecommendationWidget extends Component {
  constructor(props, context) {
    super(props, context);

    this.buttonClicked = this.buttonClicked.bind(this);

    this.state = {
      recommended : this.props.recommended,
      recommendationCount: this.props.recommendationCount
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      recommended: nextProps.recommended,
      recommendationCount: nextProps.recommendationCount
    });
  }

  buttonClicked() {
    // only note down recommendations if the user is logged in and there is a valid user id
    if (this.props.userId) {
      const action = this.state.recommended ? unrecommend : recommend;
      action({
        author_id: this.props.authorId,
        page_id: this.props.pageId,
        collection_id: this.props.collectionId ? this.props.collectionId : null
      }).then((res) => {
        let recommendationCount = this.state.recommendationCount;
        if (!this.state.recommended) {
          recommendationCount = this.state.recommendationCount ? this.state.recommendationCount + 1 : 1;
        } else {
          recommendationCount = this.state.recommendationCount ? this.state.recommendationCount - 1 : 1;
        }

        this.setState({
          recommended: !this.state.recommended,
          recommendationCount
        });
      }).catch((error) => {
        console.log(error);
      });
    } else {
      this.props.dispatch(showModal(ModalTypes.LOGIN, { ru: this.props.location.pathname }));
    }
  }

  render() {
    const submitButton = (<Btn type="button" className={styles.heartButton} onClick={this.buttonClicked}>
        <SomethingWithIcon icon={ this.state.recommended ? Icons.heartFilledIcon : Icons.heartIcon }/>
      </Btn>);

    let recommendationCountSection = null;

    if (this.state.recommendationCount > 0 && this.props.recommendationText) {
      recommendationCountSection = <span className={styles.recommendationText}>{this.state.recommendationCount} {this.props.recommendationText}</span>;
    } else if (this.state.recommendationCount > 0 && this.props.showSummary) {
      recommendationCountSection = <span className={styles.recommendationText}>{this.state.recommendationCount}</span>;
    } else if (this.state.recommendationCount > 0 && !this.props.showSummary) {
      recommendationCountSection = <span className={styles.recommendationText}>{this.state.recommendationCount} recommendation{this.state.recommendationCount > 1 ? 's' : null}</span>;
    } else if (this.state.recommendationCount == 0) {
      recommendationCountSection = <span className={styles.recommendationText}>Recommend</span>;
    }

    return (
      <div className={styles.recommendation} style={this.props.customStyle}>
        {submitButton}
        {recommendationCountSection}
      </div>
    );

  }

}

RecommendationWidget.defaultProps = {
  customStyle: {}
};

RecommendationWidget.propTypes = {
  showSummary         : PropTypes.bool,
  recommended         : PropTypes.bool,
  recommendationText  : PropTypes.string,
  recommendationCount : PropTypes.number,
  userId             : PropTypes.number,
  authorId           : PropTypes.string,
  collectionId       : PropTypes.string,
  pageId             : PropTypes.string
};

export default RecommendationWidget;
