import styles from './ArticleSummary.module.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { showModal } from '../../../actions';
import { ModalTypes } from '../../../constants';
import { RecommendationWidget } from '../../';
import { eventCategory, eventAction, sendEvent } from '../../../utils/edGA';


@connect()
class ArticleSummaryFooter extends Component {

  onPriceClick = () => {
    const { data, userInfo } = this.props;

    if (!userInfo || !userInfo.user_id) {

      let retLink = `/${data.doc_type}/${data.author_id}/${data.id}`;

      sendEvent(eventCategory.SIGNUP, eventAction.SIGNUP_INIT_BUY_WORK, retLink);

      this.props.dispatch(showModal(ModalTypes.SIGNUP, { ru: retLink }));
      return;
    }

    const paramsToCheckout = {
      title     : data.title,
      price     : data.discounted_price !== undefined && data.discounted_price !== null ? data.discounted_price : data.price,
      author_id : data.author_id,
      work_id   : data.id,
      work_type : data.doc_type,
    };

    this.props.dispatch(showModal(ModalTypes.CHECKOUT, paramsToCheckout));
  };

  renderFooterTime(data, mode) {

    if (mode !== 'write') return null;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (!data.modified) return null;

    const origDate = new Date(data.modified);
    const date = {
      time  : origDate.toLocaleTimeString().toLowerCase(),
      date  : origDate.getDate(),
      month : months[origDate.getMonth()],
      year  : origDate.getFullYear(),
    };
    const dateString = `${date.time} ${date.date} ${date.month} ${date.year}`;

    return  <span className={styles.time}>Last modified: { dateString }</span>;
  }

  render() {

    const { data, mode = 'read', url, loggedInUserId, hidePreviewLink } = this.props;

    const readMode = mode === 'read';

    const footerClass = !readMode ? styles.footer : `${styles.footer} ${styles.reader}`;
    const priceClass  = !readMode ? styles.price  : styles['price-accent'];

    const priceFormatted = data.price !== undefined && data.price !== null ? `$${data.price.toFixed(2)}` : '';
    const discountedPriceFormatted = data.discounted_price !== undefined && data.discounted_price !== null ? `$${data.discounted_price.toFixed(2)}` : '';

    const priceToShow = data.discounted_price !== undefined && data.discounted_price !== null ? discountedPriceFormatted : priceFormatted;
    const owned_by_author = data.author_id === loggedInUserId;
    const isOwned = data.owned_by_reader || owned_by_author;

    let linkToRender;
    if (readMode && (!data.is_priced || (data.is_priced && data.owned_by_reader))) {
      linkToRender = (
        <span className={styles.continue}>
          <Link to={url} query={{ authorName: data.author_name }}>Learn more</Link>
        </span>
      );
    } else if (readMode && data.is_priced && !data.owned_by_reader && !hidePreviewLink) {
      linkToRender = (
        <span className={styles.continue}>
          <Link to={url}>Preview</Link>
        </span>
      );
    } else {
      linkToRender = null;
    }

    return (
      <footer className={footerClass}>
        <div className={styles.meta}>

          { this.renderFooterTime(data, mode) }

          { data.read_time ?
              <span className={styles['read-time']}>
                { data.read_time } min read
              </span> : null }

          { !readMode ?
              null /* <span className={styles.views}>
                <SomethingWithIcon icon={Icons.peoplesIcon} text={ '658 views' }/>
              </span>*/ : null }

          { linkToRender }

        </div>

        <span>
        { data.is_priced && (!data.owned_by_reader || owned_by_author) ?
          <span role="button" onClick={readMode && !isOwned ? this.onPriceClick : null} className={priceClass}>{ `${priceToShow}` }</span> : null }
        { data.is_priced && (!data.owned_by_reader || owned_by_author) && data.discounted_price !== null && data.discounted_price !== undefined ?
          <span className={styles['original-price']}>{priceFormatted}</span> : null }
        </span>
        { this.props.children }

        {/* readMode ? <div className={styles['recommendation-container']}><RecommendationWidget showSummary/></div> : null */}

      </footer>
    );

  }

}

ArticleSummaryFooter.propTypes = {
  children        : PropTypes.node,
  dispatch        : PropTypes.func,
  mode            : PropTypes.string.isRequired,
  url             : PropTypes.string.isRequired,
  loggedInUserId  : PropTypes.number.isRequired,
  hidePreviewLink : PropTypes.bool,

  data            : PropTypes.shape({
    owned_by_reader : PropTypes.bool,
    price           : PropTypes.number,
    is_priced       : PropTypes.bool,
    author_name     : PropTypes.string,
    read_time       : PropTypes.number,
    modified        : PropTypes.string,
    id              : PropTypes.number,
    doc_type        : PropTypes.string,
    title           : PropTypes.string,
    author_id       : PropTypes.number,
  }).isRequired,
};

export default ArticleSummaryFooter;
