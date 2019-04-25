import { connect } from 'react-redux';

import { SearchComponent } from '../../components';

import { search, finishSearch } from '../../actions';

const mapDispatch = {
  searchHandler : search,
  blur          : finishSearch,
};

export default connect(null, mapDispatch)(SearchComponent);
