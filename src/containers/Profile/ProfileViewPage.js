import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import {Footer,
        ProfileFeature,
        Header,
        ProfileView,
        ProfilePicture, PageStatusControl} from '../../components';

import {load as getAuthorProfile} from "../../redux/modules/author/profile";

@connect( mapStateToProps )
export default class ProfileViewPage extends Component {
  constructor(props) {
    super(props);
  }

 componentDidMount() {
    this.props.dispatch(getAuthorProfile(this.props.author_id));
  }

  render() {
    const {profileData, author_id, contentLoading} = this.props;

    let profileImage = null;
    let coverImage = null;

    if(author_id){
      profileImage = profileData.profile_image_id ? `/api/author/profile/${author_id}/image/${profileData.profile_image_id}` : null;
      coverImage = profileData.cover_image_id ? `/api/author/profile/${author_id}/image/${profileData.cover_image_id}` : null;
    } else {
      profileImage = profileData.profile_image_id ? `/api/author/profile/image/${profileData.profile_image_id}` : null;
      coverImage = profileData.cover_image_id ? `/api/author/profile/image/${profileData.cover_image_id}` : null;
    }
    return  <div className='b-page b-page_profile'>
              <PageStatusControl loading={contentLoading} />
              <Header/>

              <ProfileFeature mode='read'
                              coverImage={coverImage}/>

              <div className='b-page__content'>
                <ProfilePicture mode='read' 
                                saveTempData={this.saveTempData}
                                picture={profileImage}/>

                <ProfileView data={this.props.profileData}/>
              </div>

              <Footer theme='dashboard'/>
            </div>;

  }
}



function mapStateToProps({router:{location, params}, user:{info}, author:{profile}}) {
  return {
    userInfo: info,
    author_id: params.author_id,
    profileData: profile.loading == false && profile.loaded == true ? profile.data : {},
    contentLoading: profile.loading == true && profile.loaded == false,
  };
}