import React, { PropTypes } from 'react';
import styles from './TuitionOffer.module.scss';
import { SomethingWithIcon, Icons } from '../index';
import BuyExpertHelpButton from './BuyExpertHelp';

const TuitionOffer = ({ title, description, duration, price, discounted_price, 
	offer_id, author_id, collection_id, userInfo }) => {
	return (
		<li className={styles['helpServices-list-item']}>
		  <div className={styles.title}>{title}</div>
		    <div className={styles.getHelpDetails}>
		      <div className={styles.description}>
		        {description}
		      </div>
		      <div className={styles.duration_price}>
		        <div className={styles.getHelpDuration}>
		          <div className="gethelp-duration-icon">
		            <SomethingWithIcon icon={Icons.clocksIcon}/>
		            <span className={styles.duration}>{duration} minutes</span>
		          </div>
		        </div>
		        <BuyExpertHelpButton
		          author_id={author_id}
		          collection_id={collection_id}
		          tuition_offer_id={offer_id}
		          userInfo={userInfo}
		          title={title}
		          price={price}
		          discounted_price={discounted_price || null}
		        />
		      </div>
		    </div>
		</li>
	);
};

TuitionOffer.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	duration: PropTypes.number.isRequired,
	price: PropTypes.number.isRequired,
	discounted_price: PropTypes.number,
	offer_id: PropTypes.number.isRequired,
	author_id: PropTypes.string.isRequired,
	collection_id: PropTypes.string.isRequired,
	userInfo: PropTypes.object,	
};

export default TuitionOffer;

