import styles from './ProfileView.module.scss';

import React, {Component, PropTypes} from 'react';

import {Icons, SomethingWithIcon,
        SquareIcon} from '../../index';

export default class ProfileView extends Component {

  static PropTypes = {
    data         : PropTypes.object,
    saveTempData : PropTypes.func.isRequired,
  };

  render() {

    const {data} = this.props;
    const baseClassName = styles['profile-view'];

    let wrapperClassName = styles.wrapper;
    let html = {__html: data.full_bio};

    const socialLinks = this.renderSocial();

    return  <div className={wrapperClassName}>
              <div className={baseClassName}>

                <div className={styles.inn}>
                  <h3 className={styles.username}>{ data.full_name }</h3>

                  { this.renderWebsite(data.website) }

                  { this.renderSocial() }

                  <div className='container'>
                    { data.short_bio ? <p className={styles.shortbio}>{ data.short_bio }</p> : null }
                  </div>

                </div>

              </div>

              <div className='container'>
                { data.full_bio  ? <div className={styles.fullbio} dangerouslySetInnerHTML={html}></div> : null }
              </div>

            </div>;

  }

  renderWebsite(website) {

    if(!website) return null;

    return  <div className={styles.website}>
              <a href={website} target='_blank'>
                <SomethingWithIcon icon={Icons.globeIcon} text={website}/>
              </a>
            </div>;
  }

  renderSocial() {
    let showSocial = false;
    let fb;
    let tw;
    let ln;
    let gh;
    const {data} = this.props;

    if(data.facebook)
      fb = <a href={data.facebook} target='_blank'><SomethingWithIcon icon={Icons.facebookIcon}/></a>;
    if(data.twitter)
      tw = <a href={data.twitter} target='_blank'><SomethingWithIcon icon={Icons.twitterIcon2}/></a>;
    if(data.linkedin)
      ln = <a href={data.linkedin} target='_blank'><SomethingWithIcon icon={Icons.linkedinIcon}/></a>;
    if(data.github)
      gh = <a href={data.github} target='_blank'><SomethingWithIcon icon={Icons.githubIcon}/></a>;

    if(fb || tw || ln || gh)
      return <div className={styles.social}>
              { fb }
              { tw }
              { ln }
              { gh }
             </div>;
    else return null;
  }

}
