import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { serverUrl } from '../../config-old';
import { getCollection, resetCollection } from '../../actions';

function mapStateToProps({ author : { collection }, loader, search }) {
  return {
    collection,
    searchString : search.searchString,
    contentLoading: loader.isLoading,
  };
}

export default function (mode, isDraft) {

  return function decorator(Page) {

    @connect(mapStateToProps)
    class CollectionPage extends Component {

      static propTypes = {
        userInfo       : PropTypes.object.isRequired,
        params         : PropTypes.object.isRequired,
        dispatch       : PropTypes.func.isRequired,
        collection     : PropTypes.object.isRequired,
        searchString   : PropTypes.string.isRequired,
        contentLoading : PropTypes.bool
      };

      constructor(props) {
        super(props);

        this.state = {
          cover_image          : {},
          is_draft_page        : typeof isDraft !== 'undefined' ? isDraft : !!location.pathname.match(/draft/gi),
        };
      }

      componentDidMount() {

        const { is_draft_page } = this.state;
        const { collection_id, user_id } = this.props.params;

        this.props.dispatch(getCollection({ collection_id, user_id, is_draft_page }));

      }

      componentWillReceiveProps(nextProps) {
        if ((!this.props.collection.size && nextProps.collection.size) ||
             nextProps.collection.getIn(['instance', 'details', 'cover_image_id'])) {
          this.setState({
            cover_image : this.prepareCollectionCover(nextProps.collection)
          });
        }
      }

      componentWillUnmount() {
        if (this.props.collection.size) {
          this.props.dispatch(resetCollection());
        }
      }

      prepareCollectionCover(collection) {
        const { collection_id, user_id } = this.props.params;

        const cover_image = {};

        if (collection.getIn(['instance', 'details', 'cover_image_id'])) {
          const imageId  = collection.getIn(['instance', 'details', 'cover_image_id']);
          const imageUrl = this.state.is_draft_page?
                `${serverUrl}/api/author/collection/${collection_id}/image/${imageId}`
                :`${serverUrl}/api/collection/${user_id}/${collection_id}/image/${imageId}`;


          cover_image.updated  = false;
          cover_image.image_id = imageId;
          cover_image.image    = imageUrl;

          if (collection.getIn(['instance', 'details', 'cover_image_metadata'])) {
            cover_image.metadata = JSON.parse(collection.getIn(['instance', 'details', 'cover_image_metadata']));
          }

        }

        return cover_image;

        // let tags = collection.instance.details.tags;

        // collection.instance.details.tags = tags.filter( tag => {
        //   return !!tag;
        // });

        // this.setState({
        //   cover_image : cover_image
        // });

      }

      render() {
        const { collection, dispatch, userInfo, searchString, contentLoading } = this.props;
        const { collection_id, user_id } = this.props.params;
        const { cover_image, is_draft_page } = this.state;
        var CodeThemes = {};
        if (collection && collection.getIn(['instance', 'details', 'CodeThemes'])) {
            CodeThemes.Code = collection.getIn(['instance', 'details', 'CodeThemes', 'Code']);
            CodeThemes.Markdown = collection.getIn(['instance', 'details', 'CodeThemes', 'Markdown']);
            CodeThemes.RunJS = collection.getIn(['instance', 'details', 'CodeThemes', 'RunJS']);
            CodeThemes.SPA = collection.getIn(['instance', 'details', 'CodeThemes', 'SPA']);
        }

        const codeExecResourceFile = {};
        if (collection && collection.getIn(['instance', 'details', 'code_exec_resource_metadata'])) {
          codeExecResourceFile.file_id = collection.getIn(['instance', 'details', 'code_exec_resource_metadata', 'file_id']);
          codeExecResourceFile.file_name = collection.getIn(['instance', 'details', 'code_exec_resource_metadata', 'file_name']);
          codeExecResourceFile.file_size = collection.getIn(['instance', 'details', 'code_exec_resource_metadata', 'file_size']);

          if (collection.getIn(['instance', 'details', 'code_exec_resource_metadata', 'file'])) {
            codeExecResourceFile.file = collection.getIn(['instance', 'details', 'code_exec_resource_metadata', 'file']);
          }

          if (collection.getIn(['instance', 'details', 'code_exec_resource_metadata', 'updated'])) {
            codeExecResourceFile.updated = collection.getIn(['instance', 'details', 'code_exec_resource_metadata', 'updated']);
          }

          if (collection.getIn(['instance', 'details', 'code_exec_resource_metadata', 'upload_url'])) {
            codeExecResourceFile.upload_url = collection.getIn(['instance', 'details', 'code_exec_resource_metadata', 'upload_url']);
          }
        }

        const props = { collection, collection_id, dispatch, userInfo, searchString, cover_image, codeExecResourceFile, contentLoading, CodeThemes };

        return (
          <Page
            is_draft={is_draft_page}
            author_id={user_id}
            {...props}
          />
        );

      }
    }

    return CollectionPage;
  };

}
