import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { collectionHelpServices } from '../../actions';

import { Footer,
        Header,
        PageStatusControl,
        GetHelpComponent } from '../../components';

@connect(mapStateToProps)
export default class GetHelp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tuition_offers: null,
      title: ''
    };
  }

  componentDidMount() {
    const { params } = this.props;

    collectionHelpServices({
      authorId: params.user_id,
      collectionId: params.collection_id
    }).then((res) => {
      const { title, tuition_offers } = JSON.parse(res).instance.details;
      this.setState({
        title,
        tuition_offers
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const { user_id, collection_id } = this.props.params;
    const { userInfo } = this.props;

    return  (<div className="b-page b-page_dashboard">
      <PageStatusControl loading={false} />
      <Header/>
      <div className="container">
        <div className="b-page__content">
          <GetHelpComponent
            author_id={user_id}
            collection_id={collection_id}
            userInfo={userInfo}
            tuition_offers={this.state.tuition_offers}
            title={this.state.title}
          />
        </div>
      </div>
      <Footer theme="dashboard"/>
    </div>);
  }
}

GetHelp.propTypes = {
  params: PropTypes.object.isRequired,
  userInfo: PropTypes.object
};

function mapStateToProps({ router:{ location, params }, user:{ info } }) {
  return { };
}
