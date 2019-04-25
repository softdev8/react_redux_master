import styles from './ProfileForm.module.scss';

import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import {LabelledInput, Btn} from '../../index';

import getAllKeys from '../../../utils/objectUtils'

import ProfilePicture from '../ProfilePicture/ProfilePicture';

export default class ProfileForm extends Component {

  static PropTypes = {
    data : PropTypes.object.isRequired,
    name : PropTypes.string.isRequired,
    mode : PropTypes.string,
    saveData : PropTypes.func.isRequired,
    saveTempData  : PropTypes.func.isRequired,
    startSaveData : PropTypes.bool.isRequired,
    needResetData : PropTypes.bool.isRequired,
    hasCoverImage : PropTypes.bool,
    hasProfileImage : PropTypes.bool,
    profileImage  : PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if(nextProps.startSaveData) {
      this.collectData();
    }
  }

  componentDidMount() {
    const firstInputNode = findDOMNode(this.refs[this.props.name]).elements[0];

    firstInputNode.focus();
  }

  render() {

    const {mode = 'read', name, data} = this.props;

    const baseClassName = styles['profile-form'];

    let className = baseClassName;

    if(!this.props.hasCoverImage) {
      className += ` ${styles['no-banner']}`;
    }

    if(!this.props.hasProfileImage) {
      className += ` ${styles['no-profile-picture']}`;
    }

    const linksFields = getAllKeys(links).map( (link, i) => {
      return <LabelledInput  key={i} label={link} addonBefore={links[link].providerUrl}
                              name={link}
                              value={data[link]}/>
    });

    return  <div className={className}>

              <form className='form-horizontal' ref={name} name={name}>

                {/*<ProfilePicture mode={mode} saveTempData={this.props.saveTempData}/>*/}

                <LabelledInput label='full name' help='Max 100 words'
                                name='full_name'
                                value={data.full_name}
                                placeholder='Add your full name'/>
                <LabelledInput type='textarea' label='short bio' help='Something about you'
                                name='short_bio'
                                value={data.short_bio}
                                placeholder='Add short bio'/>
                <LabelledInput ref='full_bio' type='textarea' label='full bio' help='Write more about you'
                                name='full_bio'
                                value={data.full_bio}
                                placeholder=' '/>

                { linksFields }

              </form>
            </div>;
  }

  collectData() {
    const formNode = findDOMNode(this.refs[this.props.name]);
    const elementsCount = formNode.elements.length;

    let data = {};

    for(let i = 0; i < elementsCount; i++) {

      if(formNode.elements[i].name != ""){
        if(links[formNode.elements[i].name]){
          if (formNode.elements[i].value.indexOf("http://") > -1 || formNode.elements[i].value.indexOf("https://") > -1) {
            data[formNode.elements[i].name] = formNode.elements[i].value;
          } else {
            if(formNode.elements[i].value == ""){
              data[formNode.elements[i].name] = "";
            } else {
              data[formNode.elements[i].name] = `http://${formNode.elements[i].value}`;
            }
          }
        } else {
          data[formNode.elements[i].name] = formNode.elements[i].value;
        }
      }
    }

    //Fetch data from Medium based Text Editor
    data.full_bio = this.refs.full_bio.getValue();

    this.props.saveData(data);
  }
}

const links = {
  twitter: {},
  github: {},
  linkedin: {},
  facebook: {},
  website : {},
}