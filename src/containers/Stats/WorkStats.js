import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { collectionStats, collectionSales } from '../../actions';

import { Footer,
        Header,
        PageStatusControl,
        StatsComponent } from '../../components';

@connect(mapStateToProps)
export default class WorkStats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      salesData : null,
      salesLoaded: false,
      statsLoaded: false
    };
  }

  componentDidMount() {
    const { params } = this.props;

    collectionSales(params.collection_id).then((res) => {
      const result = JSON.parse(res);
      this.setState({
        salesData: result.sales,
        statsLoaded: true
      });
    }).catch((error) => {
      this.setState({
        salesData: null,
        salesLoaded: true
      });
    });
  }

  render() {
    return  (<div className="b-page page_dashboard">
      <PageStatusControl loading={false} />
      <Header/>
      <div className="container">
        <div className="b-page__content">
          <StatsComponent salesData={this.state.salesData} />
        </div>
      </div>
      <Footer theme="dashboard"/>
    </div>);
  }
}

function mapStateToProps({ router:{ location, params }, user:{ info } }) {
  return {
    userInfo: info
  };
}
