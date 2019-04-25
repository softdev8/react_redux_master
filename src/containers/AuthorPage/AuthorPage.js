import React, { Component, PropTypes } from 'react';
import { LandingPageHeader, AuthorPageFeature, TryBlock, AuthorHowItWorks, BecomeAuthor,  DashboardContent, LandingPageFooter} from '../../components';
import commonDashboardDecorator from '../../containers/DashboardPages/CommonDashboardDecorator';
import { connect } from 'react-redux';
const THEME = 'landing';

@commonDashboardDecorator(false)
@connect()
class Page extends Component {

  static PropTypes = {
    articles : PropTypes.array.isRequired,
    userInfo : PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
  }

  render() {
    let { articles, userInfo } = this.props;
    const divStyle = {
       'background-color' : 'white',
    }
    return (
      <div className={`b-page b-page_${THEME}`}>

        <LandingPageHeader hideAuthor/>

        <AuthorPageFeature />
        <TryBlock />
        <AuthorHowItWorks />
        <BecomeAuthor />

        <div className="b-content-wrapper" style = {divStyle}>
          <div className="container">
            <div className="b-page__content" id="featured">

                <DashboardContent articles={articles} userInfo={userInfo} mode='read'/>

            </div>
          </div>
        </div>

        <LandingPageFooter theme={THEME} />

      </div>
    );
  }
}

export default Page;
