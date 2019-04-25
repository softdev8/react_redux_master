import styles from './TeamPage.module.scss';

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import {Footer,
        Header, SomethingWithIcon, Icons, Brands} from '../../components';

import {Agreements} from '../../constants';


export default class TeamPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className='b-page b-page_profile'>
            <Header/>
      <div className="container">
          <div className="row text-center" style={{marginTop:'30px'}}>
              <div className="col-md-6 col-sm-6 text-center">
                  <img className="team-image" src="/imgs/team/fahim.jpg" />
                  <h4>Fahim Ul Haq</h4>
                  <h5>Co-founder / CEO</h5>
                   <div className={styles.connect}>
                    <a href='https://www.linkedin.com/in/fahimulhaq' target="_blank"><SomethingWithIcon icon={Brands.linkedin}/></a>
                    <a href='https://twitter.com/fahimulhaq' target="_blank"><SomethingWithIcon icon={Icons.twitterIcon2}/></a>
                    <a href='mailto:fahim@educative.io' target="_blank"><SomethingWithIcon icon={Icons.mailIcon}/></a>
                  </div>
              </div>
              <div className="col-md-6 col-sm-6 text-center">
                  <img className="team-image" src="/imgs/team/naeem.jpg" />
                  <h4>Naeem Ul Haq</h4>
                  <h5>Co-founder / CTO</h5>
                  <div className={styles.connect}>
                    <a href='https://www.linkedin.com/in/naeemulhaq' target="_blank"><SomethingWithIcon icon={Brands.linkedin}/></a>
                    <a href='https://twitter.com/_Naeemulhaq' target="_blank"><SomethingWithIcon icon={Icons.twitterIcon2}/></a>
                    <a href='mailto:naeem@educative.io' target="_blank"><SomethingWithIcon icon={Icons.mailIcon}/></a>
                  </div>
              </div>
          </div>
          <div className="row text-center" style={{marginTop:'30px'}}>
              <div className="col-md-6 col-sm-6 text-center">
                  <img className="team-image" src="/imgs/team/devin.jpg" />
                  <h4>Devin Balkcom</h4>
                  <h5>Advisor</h5>
                   <div className={styles.connect}>
                    <a href='https://www.linkedin.com/in/devin-balkcom-b4783316' target="_blank"><SomethingWithIcon icon={Brands.linkedin}/></a>
                    <a href='https://ssl.cs.dartmouth.edu/~devin/' target="_blank"><SomethingWithIcon icon={Icons.globeIcon}/></a>
                  </div>
              </div>
          </div>
      </div>
      <div className="space-bottom"></div>
      <Footer theme='dashboard'/>
    </div>;
  }
}
