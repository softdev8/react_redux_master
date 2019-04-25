import styles from './ProfileSmall.module.scss';

import React, {PropTypes, Component} from 'react';
import {findDOMNode} from 'react-dom';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import {Link} from 'react-router';

import {Icons, Userpic} from '../../index';

import targetInParent from '../../../utils/targetInParent';
import { logout } from '../../../actions';
import { clear as cleanUser } from '../../../redux/modules/user/info';
import { clear as cleanWork } from '../../../redux/modules/author/work';
import { clear as cleanReader } from '../../../redux/modules/reader/featured';

@connect(state=>({}), { pushState, cleanReader, cleanUser, cleanWork })
export default class ProfileSmall extends Component {

  static PropTypes = {
    data : PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.toggleMenu            = this.toggleMenu.bind(this);
    this.onLogoutClick         = this.onLogoutClick.bind(this);
    this.isClickOutsideProfile = this.isClickOutsideProfile.bind(this);

    this.state = {
      showMenu : false,
    }
  }

  componentDidMount() {
    // close menu if clicked not on submenu
    document.addEventListener('click', this.isClickOutsideProfile);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.isClickOutsideProfile);
  }

  render() {
    const {data = {}} = this.props;
    const {showMenu}  = this.state;
    const image = '/api/author/profile/profileimage';
    const dropdownStyles = { right : showMenu ? 0 : -9999 };

    //TODO: soban - Add settings back once its ready
    //<li><Link className={styles.link} to='/settings'>Settings</Link></li>
    return  <div className={styles.profile} onClick={this.toggleMenu} ref='profile'>

              <Userpic image={image}/>

              <div className={styles.dropdown}
                   style={dropdownStyles}>
                <ul className={styles.list}>
                  <li>
                    <Link className={styles.link} to='/profile/view'>My Profile</Link>
                    <ul className={styles.submenu}>
                      <li><Link className={styles.link} to='/profile/view'>View</Link></li>
                      <li><Link className={styles.link} to='/profile/edit'>Edit</Link></li>
                    </ul>
                  </li>
                  <li><span className={styles.link} onClick={this.onLogoutClick}>Logout</span></li>
                </ul>
              </div>

            </div>;
  }

  toggleMenu(e) {

    this.setState({
      showMenu : !this.state.showMenu,
    });

  }

  onLogoutClick(e) {
    logout().then( () => {
      this.props.cleanUser();
      this.props.cleanWork();
      this.props.cleanReader();
      this.props.pushState(null, '/');
    });
  }

  isClickOutsideProfile(e) {
    const profile  = findDOMNode(this.refs.profile);

    if(targetInParent(profile, e.target)) return;
    else {

      this.setState({
        showMenu : false,
      });

    }
  }
}