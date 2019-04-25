import { connect } from 'react-redux';
import { PageStatusControl } from '../../components';

const mapState = state => ({
  loading: state.loader.isLoading,
});

export default connect(mapState)(PageStatusControl);
