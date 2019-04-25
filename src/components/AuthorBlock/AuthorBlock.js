import styles from './AuthorBlock.module.scss';

import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

import { Userpic } from '../index';
import {SomethingWithIcon, Icons} from '../index';
import { serverUrl } from '../../config-old';

class AuthorBlock extends Component {

  render() {

    const { author_id, author_name, creation_date, tags } = this.props;

    const className = classnames(this.props.className, styles['author-block']);

    // How to determine if response contains image, not html etc.?
    // now server returns index.html;
    let profileImage;
    if (author_id) {
      profileImage = `${serverUrl}/api/author/profile/${author_id}/profileimage`;
    } else {
      profileImage = null;
    }

    let profileUrl;
    if (author_id) {
      profileUrl = `${serverUrl}/profile/view/${author_id}`;
    } else {
      profileUrl = null;
    }

    let tagsNode = null;

    if (!tags || tags.length === 0 || tags.length === 1 && tags[0] === '') {
      tagsNode = null;
    } else {
      tagsNode = tags.map((tag, i, array) => {
        const comma = i < array.length - 1 ? ',' : '';

        return (
          <li key={i}>
            <a href="#">{ `${tag}${comma}` }</a>
          </li>
        );
      });
    }

    return (
      <div className={className}>

        <div>
          <Userpic image={profileImage} className={styles.userpic}/>

          <div className={styles.info}>
            <div className={styles.name}>
              <Link to={profileUrl}>{ author_name }</Link>
            </div>

            { (tagsNode ? [
              <SomethingWithIcon icon={Icons.tagIcon} key="icon"/>,
              <ul key="tags" className={styles.tags}>{ tagsNode }</ul>,
            ] : null) }

          </div>
        </div>

      </div>
    );
  }
}

AuthorBlock.propTypes = {
  author_id : PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,

  author_name   : PropTypes.string,
  className     : PropTypes.string,
  creation_date : PropTypes.string,
  tags          : PropTypes.arrayOf(PropTypes.string),
};

export default AuthorBlock;
