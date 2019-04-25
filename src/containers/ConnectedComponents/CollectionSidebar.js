import { connect } from 'react-redux';

import { CollectionSidebar } from '../../components';

import { finishSearch } from '../../actions';

const mapState = state => ({
  searchString : state.search.searchString,
});

const mapDispatch = {
  finishSearch,
};

export default connect(mapState, mapDispatch)(CollectionSidebar);
