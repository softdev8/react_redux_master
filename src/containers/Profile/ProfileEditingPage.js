import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import {Footer, Header,
        ProfileButtonsPanel,
        ProfileFeature,
        ProfileForm,
        ProfilePicture,
        PageStatusControl} from '../../components';

import {saveProfile, getProfileImagesUrl, uploadCover, showModal, updateModal} from '../../actions';

import {ModalTypes} from '../../constants';

import {load as getAuthorProfile} from "../../redux/modules/author/profile";

import { promiseFunc } from '../../utils';


@connect( mapStateToProps )
export default class ProfileEditingPage extends Component {

  constructor(props) {
    super(props);

    this.saveProfile  = this.saveProfile.bind(this);
    this.saveTempData = this.saveTempData.bind(this);
    this.discard      = this.discard.bind(this);
    this.collectData  = this.collectData.bind(this);
    this.uploadCoverImage     = this.uploadCoverImage.bind(this);
    this.uploadProfileImage   = this.uploadProfileImage.bind(this);
    this.persistStateOnServer = this.persistStateOnServer.bind(this);

    this.state = {
      profileData    : {},
      newProfileData : null,
      needSaveData   : false,
      needResetData  : false,
      coverImage     : {},
      profileImage   : {},
    }
  }

  componentDidMount() {
    this.props.dispatch(getAuthorProfile());
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.profileData != this.state.profileData){

      let coverImageMetadata = null;
      if (nextProps.profileData.cover_image_metadata) {
        coverImageMetadata = JSON.parse(nextProps.profileData.cover_image_metadata);
      }
      let coverImage = {
        image    : nextProps.profileData.cover_image_id ? `/api/author/profile/image/${nextProps.profileData.cover_image_id}` : null,
        image_id : nextProps.profileData.cover_image_id,
        metadata : coverImageMetadata,
        updated  : false,
      }

      let profileImageMetadata = null;
      if (nextProps.profileData.profile_image_metadata) {
        profileImageMetadata = JSON.parse(nextProps.profileData.profile_image_metadata);
      }
      let profileImage = {
        image    : nextProps.profileData.profile_image_id ? `/api/author/profile/image/${nextProps.profileData.profile_image_id}` : null,
        image_id : nextProps.profileData.profile_image_id,
        metadata : profileImageMetadata,
        updated  : false,
      }

      this.setState({
        profileData  : nextProps.profileData,
        profileImage,
        coverImage,
      });
    }
  }

  render() {
    const {profileData, needSaveData, newProfileData, coverImage, profileImage} = this.state;

    return  <div className='b-page b-page_profile'>
              <PageStatusControl loading={this.props.contentLoading} />
              <Header/>

              <ProfileButtonsPanel  save={this.saveProfile}
                                    discard={this.discard}/>

              <ProfileFeature saveTempData={this.saveTempData}
                              mode='write'
                              coverImage={coverImage.image}/>

              <div className='container'>
                <div className='b-page__content'>

                  <ProfilePicture mode='write'
                                  saveTempData={this.saveTempData}
                                  picture={profileImage.image}/>

                  <ProfileForm  startSaveData={needSaveData}
                                saveTempData={this.saveTempData}
                                saveData={this.collectData}
                                mode='write'
                                hasProfileImage={ Boolean(profileImage.image) }
                                hasCoverImage={ Boolean(coverImage.image) }
                                data={profileData}
                                name='user_profile'/>
                </div>
              </div>
              <Footer theme='dashboard'/>
            </div>;

  }

  saveProfile() {
    this.setState({
      needSaveData : true,
    });

  }

  discard() {
    this.props.dispatch(getAuthorProfile());
  }

  saveTempData(newImage) {
    if(newImage.hasOwnProperty('cover_image')){
        if(!newImage.cover_image) {
          let coverImage = {
            image      : newImage.cover_thumbnail,
            file       : newImage.cover_image,
            updated    : true,
          }

          this.setState({
            coverImage,
          });

          return;
        }

        getProfileImagesUrl().then( image => {
          image = JSON.parse(image);

          let coverImage = {
            image      : newImage.cover_thumbnail,
            file       : newImage.cover_image,
            image_id   : image.image_id,
            metadata   : newImage.metadata,
            upload_url : image.upload_url,
            updated    : true,
          }

          this.setState({
            coverImage,
          });
        });

    } else if(newImage.hasOwnProperty('profile_image')){

        if(!newImage.profile_image) {
          let profileImage = {
            image      : newImage.profile_thumbnail,
            file       : newImage.profile_image,
            updated    : true,
          }

          this.setState({
            profileImage,
          });

          return;
        }

        getProfileImagesUrl().then( image => {
          image = JSON.parse(image);

          let profileImage = {
            image      : newImage.profile_thumbnail,
            file       : newImage.profile_image,
            image_id   : image.image_id,
            metadata   : newImage.metadata,
            upload_url : image.upload_url,
            updated    : true,
          }

          this.setState({
            profileImage,
          });

        });
    }
  }


  uploadCoverImage(payload, callback){
    const {coverImage} = this.state;

    if(coverImage.file && coverImage.updated) {

      promiseFunc(this.props.dispatch, uploadCover, [coverImage]).then(
        image_data => {
          image_data = JSON.parse(image_data);

          if(image_data) {
            coverImage.updated   = false;
            coverImage.file_name = image_data.file_name;
            coverImage.image     = `/api/author/profile/image/${image_data.image_id}`;
            coverImage.image_id  = image_data.image_id;
          }

          payload.coverImage = coverImage;
          callback(payload);
        }).catch( error => {
          this.props.dispatch(updateModal({status:'ERROR', text:'Unable to upload Cover Image'}));
        });
    } else {
      payload.coverImage = coverImage;
      callback(payload);
    }
  }

  uploadProfileImage(payload, callback){
    const {profileImage} = this.state;

    if(profileImage.file && profileImage.updated) {

      promiseFunc(this.props.dispatch, uploadCover, [profileImage]).then(
        image_data => {
          image_data = JSON.parse(image_data);

          if(image_data) {
            profileImage.updated   = false;
            profileImage.file_name = image_data.file_name;
            profileImage.image     = `/api/author/profile/image/${image_data.image_id}`;
            profileImage.image_id  = image_data.image_id;
          }
          payload.profileImage = profileImage
          callback(payload);
        }).catch( error => {
          this.props.dispatch(updateModal({status:'ERROR', text:'Unable to upload Profile Image'}));
        });
    } else {
      payload.profileImage = profileImage
      callback(payload);
    }
  }

  collectData(data) {
    let payload = {data};

    this.props.dispatch(showModal(ModalTypes.PROGRESS,{status:'WAIT', text:'Uploading Images'}));

    this.uploadCoverImage(payload,
      (payload)=>this.uploadProfileImage(payload,
        (payload)=>this.persistStateOnServer(payload)));
  }

  persistStateOnServer(payload){
    const profileCoverImageMetadata = payload.coverImage.metadata ? JSON.stringify(payload.coverImage.metadata) : '';
    const profileImageMetadata = payload.profileImage.metadata ? JSON.stringify(payload.profileImage.metadata) : '';

    let image_data = {
      cover_image_id: payload.coverImage.image_id,
      cover_image_metadata: profileCoverImageMetadata,
      profile_image_id: payload.profileImage.image_id,
      profile_image_metadata: profileImageMetadata,
    };

    const dataToSend = {...image_data, ...payload.data}
    this.props.dispatch(saveProfile(dataToSend,()=>{

      this.props.dispatch(updateModal({status:'SUCCESS', text:'Profile Saved'}));
      this.setState({
        profileData: dataToSend,
        needSaveData   : false,
      })
    }));
  }
}



function mapStateToProps({user:{info}, author:{profile}}) {
  return {
    userInfo       : info,
    profileData    : profile.loading == false && profile.loaded == true ? profile.data : {},
    contentLoading : profile.loading,
  };
}