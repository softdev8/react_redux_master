import styles from './CollectionPageSummary.module.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { PageSummary, RecommendationWidget, SubscribeWidget } from '../../index';
import CollectionWidgetStats from '../CollectionWidgetStats/CollectionWidgetStats';
import { Btn } from '../../commonUI';
import { OverlayTrigger, Popover } from 'react-bootstrap';

import { showModal } from '../../../actions';
import { ModalTypes } from '../../../constants';
import { eventCategory, eventAction, sendEvent } from '../../../utils/edGA';

@connect(state => ({}))
class CollectionPageSummary extends Component {

  static propTypes = {
    author : PropTypes.shape({
      author_id : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,

      author_name : PropTypes.string,
    }).isRequired,

    pageSummary : PropTypes.shape({
      title       : PropTypes.string,
      description : PropTypes.string,
      tags        : PropTypes.arrayOf(PropTypes.string),
    }).isRequired,

    price : PropTypes.shape({
      price : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),

      is_priced       : PropTypes.bool,
      owned_by_reader : PropTypes.bool,
    }).isRequired,

    userInfo          : PropTypes.object.isRequired,
    collection_id     : PropTypes.string.isRequired,
    firstArticleLink  : PropTypes.string,
    firstPreviewableArticleLink: PropTypes.string,
    dispatch          : PropTypes.func,
    is_draft          : PropTypes.bool,
    recommendations   : PropTypes.number,
    recommended       : PropTypes.bool,
    subscribed        : PropTypes.bool,
    widgetStats       : PropTypes.object,
    lessonCount       : PropTypes.number,
    showMentoringButton: PropTypes.bool,
    freePreviewLessonCount: PropTypes.number
  };

  constructor(props) {
    super(props);

    this.onPriceClick = this.onPriceClick.bind(this);
    this.onGetHelpClick = this.onGetHelpClick.bind(this);
  }

  onPriceClick() {
    const { author, pageSummary, price, firstArticleLink, collection_id, userInfo, is_draft } = this.props;

    if (is_draft) {
      this.props.dispatch(showModal(ModalTypes.PROGRESS, { status:'SUCCESS', text:'Checkout Dialog will be shown here' }));
      return;
    }

    if (!userInfo || !userInfo.user_id) {
      this.props.dispatch(showModal(ModalTypes.LOGIN, { ru: '/collection/{0}/{1}'.format(author.author_id, collection_id) }));
      return;
    }

    const paramsToCheckout = {
      title         : pageSummary.title,
      price         : price.discounted_price !== undefined && price.discounted_price !== null ? price.discounted_price : price.price,
      author_id     : author.author_id,
      work_id       : collection_id,
      work_type     : 'collection',
      redirect_url  : firstArticleLink,
    };

    this.props.dispatch(showModal(ModalTypes.CHECKOUT, paramsToCheckout));
  }

  onGetHelpClick() {
    const { author, collection_id, is_draft } = this.props;
    const author_id = author.author_id;

    if (is_draft) {
      this.props.dispatch(showModal(ModalTypes.PROGRESS, { status:'SUCCESS', text:'Coaching options will be shown to the learner here.'}));
      return;
    }

    this.props.dispatch(pushState(null, `/collection/${author_id}/${collection_id}/experthelp`));
  }

  onPreviewCourse = () => {
    const { author: {author_id}, collection_id } = this.props;
    sendEvent(eventCategory.VIEW, eventAction.VIEW_COURSE_PREVIEW, `/collection/${author_id}/${collection_id}`);

    this.props.dispatch(pushState(null, this.props.firstPreviewableArticleLink));
  }

  render() {
    const { freePreviewLessonCount, author, pageSummary, price, firstArticleLink, firstPreviewableArticleLink, userInfo, collection_id, is_draft } = this.props;
    const readMode = true;
    const priceFormatted = price.price !== undefined && price.price !== null ? `$${price.price.toFixed(2)}` : '';
    const discountedPriceFormatted = price.discounted_price !== undefined && price.discounted_price !== null ? `$${price.discounted_price.toFixed(2)}` : '';

    let priceToShow = price.discounted_price !== undefined && price.discounted_price !== null ? discountedPriceFormatted : priceFormatted;

    const owned_by_author = author.author_id === (userInfo ? userInfo.user_id : null);
    const isOwned = price.owned_by_reader || owned_by_author;
    const footerClass = `${styles.footer}`;

    let linkToShow;
    if (!price.is_priced && firstArticleLink) {
      linkToShow = <span role="button" onClick={() => this.props.dispatch(pushState(null, this.props.firstArticleLink))} className={styles['action-accent']}>Begin Learning</span>;
    } else if (price.is_priced && (price.owned_by_reader || owned_by_author) && firstArticleLink) {
      linkToShow = <span role="button" onClick={() => this.props.dispatch(pushState(null, this.props.firstArticleLink))} className={styles['action-accent']}>Begin Learning</span>;
    }
    // else if (price.is_priced && (!price.owned_by_reader || owned_by_author) && firstPreviewableArticleLink) {
    //   linkToShow = <div role="button" onClick={() => this.props.dispatch(pushState(null, this.props.firstPreviewableArticleLink))} className={styles['action-accent']}>Preview</div>;
    // }

    let zeroPriceCourse = false;
    let signupRequiredText = null;
    if (price.is_priced && (!price.owned_by_reader || owned_by_author) && (price.price === 0.0 || price.discounted_price === 0.0)) {
      priceToShow = 'Get for ' + priceToShow + ' (FREE) *';
      signupRequiredText = <p className={styles['signup-req-accent']}>* Free Signup Required</p>;
      zeroPriceCourse = true;
    } else if (price.is_priced) {
      priceToShow = 'Buy for ' + priceToShow + ' *';
    }

    let styleCallAction1Bottom = { borderBottom:"1px solid orange", paddingBottom:10 };

    return (
        <PageSummary author={author} pageSummary={pageSummary}>
          {/* is_draft ? null :
            <SubscribeWidget
                subscribed={this.props.subscribed}
                authorId={author.author_id}
                collectionId={collection_id}
                userId={userInfo ? userInfo.user_id : null}
            /> */}
          <footer className={footerClass}>
              <div style={{textAlign: 'center'}}>
                <CollectionWidgetStats
                  widgetStats={this.props.widgetStats}
                  lessonCount={this.props.lessonCount}
                />
                {
                    !isOwned &&
                    freePreviewLessonCount > 0 ? (
                    <div>
                      <Btn small secondary
                        className={styles.tuition_offer_add_button}
                        onClick={this.onPreviewCourse}
                        text="Preview this course"
                        style={{textTransform: 'none', padding: '5px 20px', borderRadius: '4px', width: '225px', fontSize:17, fontWeight:'300' }}
                      />
                      <p>{freePreviewLessonCount + ' FREE Preview Lessons'}</p>
                    </div>
                  ) : (
                    ''
                  )
                }

                {
                  is_draft ? null :
                  <div>
                    <RecommendationWidget
                      authorId={author.author_id}
                      collectionId={collection_id}
                      userId={userInfo ? userInfo.user_id : null}
                      recommendationText = ""
                      recommendationCount={this.props.recommendations}
                      recommended={this.props.recommended}
                      customStyle={{ textAlign:'center', marginTop:15, marginBottom:20 }}

                    />
                  </div>
                }

              </div>
              <div style={{ lineHeight: '25px', textAlign:'center' }}>
                {/* price.is_priced && (price.owned_by_reader) ?
                    <span className={styles['owned-accent']}> Owned </span> : null */}
                { linkToShow }
                { /*price.is_priced && (!price.owned_by_reader || owned_by_author) && price.discounted_price !== null ?
                    <span className={styles['original-price']} style={{ fontSize: '17px' }}>{priceFormatted}</span> : null */}
                { price.is_priced && (!price.owned_by_reader || owned_by_author) ?
                    <span>
                      { price.is_priced && (!price.owned_by_reader || owned_by_author) && price.discounted_price !== null ?
                        <span className={styles['original-price']} style={{ fontSize: '17px', marginRight:10 }}>{priceFormatted}</span> : null
                      }
                      <span role="button" onClick={readMode && !isOwned ? this.onPriceClick : null} className={styles['price-accent']} style={{marginLeft: '0px', padding: '5px 25px'}} >
                        { priceToShow }
                      </span>
                    </span> : null }
                {
                  this.props.showMentoringButton &&
                  <div className={ styles.coaching }>
                    <span role="button" onClick={this.onGetHelpClick} className={styles['coaching-accent']} style={{marginLeft: '0px'}}>Schedule live 1:1 mentoring</span>
                  </div>
                }
                { price.is_priced && (price.owned_by_reader) ?
                    <span className={styles['call-to-action']}>
                      <i>
                        <div>You've lifetime access to this course.</div>
                      </i>
                    </span> :
                    price.is_priced &&
                    <span className={styles['call-to-action']}>
                      <i>
                        {signupRequiredText}
                        <div>* Full lifetime access</div>
                        { !zeroPriceCourse && <div>* 30-day money back guarantee</div>}
                        {
                          !zeroPriceCourse &&
                          <OverlayTrigger
                            trigger={['hover', 'focus', 'click']} placement="bottom"
                            overlay={
                              <Popover id="popover-trigger-hover-focus">
                                Email us at invoice@educative.io
                              </Popover>
                            }
                          >
                            <div className={styles.invoice} style={{textAlign: 'center', marginTop:20 }}>Need an invoice?</div>
                          </OverlayTrigger>
                        }
                      </i>
                    </span>
                }
              </div>
          </footer>
        </PageSummary>
    );
  }
}

export default CollectionPageSummary;
