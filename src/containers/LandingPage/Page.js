import React, { Component, PropTypes } from 'react';
import { LandingPageHeader, PageFeature, Testimonials, LandingPageFooter, DashboardContent } from '../../components';
import commonDashboardDecorator from '../../containers/DashboardPages/CommonDashboardDecorator';
import { connect } from 'react-redux';
import { replaceState } from 'redux-router';
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

    reRouteIfLoggedIn(props) {
        if (props.userInfo && props.userInfo.user_name) {
            props.dispatch(replaceState(null, '/learn'));
        }
    }

    componentWillMount() {
        this.reRouteIfLoggedIn(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.reRouteIfLoggedIn(nextProps);
    }

    render() {
        let { articles, userInfo } = this.props;
        const divStyle = {
            'background-color' : 'white',
            paddingTop: 20
        }
        return (
            <div className={`b-page b-page_${THEME}`}>

                <LandingPageHeader />

                <PageFeature />

                <Testimonials />

                <div className="b-content-wrapper" style={divStyle}>
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
