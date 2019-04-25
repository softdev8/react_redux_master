import React, { Component, PropTypes } from 'react';
import { pushState } from 'redux-router';
import { connect } from 'react-redux';

import { Header, Footer, Icons,
         CollectionContentView,
         CollectionFeature,
         CollectionButtonsPanel } from '../../components';

import { load as getAuthorProfile } from '../../redux/modules/author/profile';

import decorator from './collectionPageDecorator';

@decorator('read')
@connect(state => {

  const { location } = state.router;
  const { profile }  = state.author;
  let authorName = null;

  if (location.query && location.query.authorName) {
    authorName = location.query.authorName;
  }

  return {
    authorName : authorName === null && profile.loading === false && profile.loaded === true ? profile.data.full_name : authorName
  };
})
class ViewCollectionPage extends Component {

  static propTypes = {
    userInfo       : PropTypes.object.isRequired,
    author_id     : PropTypes.string.isRequired,
    authorName    : PropTypes.string,
    collection    : PropTypes.object.isRequired,
    collection_id : PropTypes.string.isRequired,
    cover_image   : PropTypes.object.isRequired,
    dispatch      : PropTypes.func.isRequired,
    is_draft      : PropTypes.bool.isRequired,
    searchString  : PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.onEdit = this.onEdit.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getAuthorProfile(this.props.author_id));
  }

  onEdit() {
    this.props.dispatch(pushState(null, `/collectioneditor/${this.props.collection_id}`));
  }

  getPanelButtons() {
    return [{
      type   : 'primary',
      text   : 'Edit',
      method : this.onEdit,
      icon   : Icons.pencilIcon,
    }];
  }

  render() {
    const { collection, cover_image, searchString, userInfo,
            author_id, authorName, collection_id, is_draft } = this.props;

    return (
      <div className="b-page b-page_dashboard">

        <Header/>

        {is_draft ? <CollectionButtonsPanel customButtons={this.getPanelButtons()}/> : null}

        { cover_image.image &&
          <CollectionFeature coverImage={`${cover_image.image}.png`}
                             mode="read"/> }

        <div className="container">
          <CollectionContentView collection={collection}
                                 collection_id={collection_id}
                                 is_draft={is_draft}
                                 author_id={author_id}
                                 authorName={authorName}
                                 searchString={searchString}
                                 userInfo={userInfo}
                                 />
        </div>

        <Footer theme="dashboard"/>
      </div>
    );
  }

}

export default ViewCollectionPage;
