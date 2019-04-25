import { connect } from 'react-redux';
import { createAction } from 'redux-actions';

import { CollectionDetails } from '../../components';


function mapDispatch(dispatch) {
  return {
    onTextChange: (newData) => dispatch(createAction('UPDATE_COLLECTION_DETAILS')(newData)),
  };
}

export default connect(null, mapDispatch)(CollectionDetails);
