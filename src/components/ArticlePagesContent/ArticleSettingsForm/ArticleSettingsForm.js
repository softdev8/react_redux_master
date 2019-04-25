import commonFormStyles from '../../Forms/Form.module.scss';
import styles from './ArticleSettings.module.scss';

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import { pageSummary, closeModal, pageEditor } from '../../../actions';

import {Btn, SimpleLabelledInput, SimplePriceInput, Select, SomethingWithIcon, Icons} from '../../index';

@connect(( {pageSummary, router} ) => {
  return {pageSummary, router}
})
export default class ArticleSettingsForm extends Component {

  static PropTypes = {
    // closeModal              : PropTypes.func.isRequired,
    // handlePageSummaryChange : PropTypes.func.isRequired,
    pageSummary : PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.saveSettings = this.saveSettings.bind(this);
    this.onPaidChange = this.onPaidChange.bind(this);
    this.onPriceBlur = this.onPriceBlur.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);

    this.state = {
      is_priced : props.pageSummary.get('is_priced'),
      price     : props.pageSummary.get('price'),
      version   : props.pageSummary.get('version'),
    }
  }

  render() {

    const formBaseClass = commonFormStyles.form;

    const paidSelect = this.getPaidField()

    const inputs = this.getFields().map( (field, i) => {
      const value = this.state[field.name];

      if (field.name == 'price') {
            let price = '';
            if (!value && this.state.is_priced) price = '0';
            if (value && this.state.is_priced)  price = value;

            return  <SimplePriceInput key={i}
                                label={field.name}
                                name='price'
                                ref={field.name.replace(' ', '_')}
                                minPrice='0'
                                maxPrice='999'
                                disabled={!this.state.is_priced}
                                onBlur = {this.onPriceBlur}
                                value={price}/>;
      }
      else {
            return <SimpleLabelledInput key={i}
                                label={field.name}
                                name={field.name}
                                ref={field.name.replace(' ', '_')}
                                value={value}/>;
      }
    });

    let deleteBtn = null;
    if(!this.props.router.params.collection_id){
      deleteBtn = <div className={styles.delete}>
                    <Btn primary  onClick={this.deleteArticle}>
                        <SomethingWithIcon icon={Icons.trashIconDraft} text='Delete Article'/>
                    </Btn>
                    <p><i>*Once an article is deleted it cannot be recovered</i></p>
                  </div>;
    }

    return  <div className={formBaseClass}>

              <div className={commonFormStyles.body}>
                <div className={`${commonFormStyles.column} ${commonFormStyles.single}`}>
                  <form className={commonFormStyles.form} onSubmit={this.saveSettings}>

                    { paidSelect }
                    { inputs }

                    {deleteBtn}

                    <Btn secondary type='submit' data-close-modal onClick={this.saveSettings}>OK</Btn>

                  </form>
                </div>
              </div>

            </div>;
  }

  onPriceBlur(e) {
    this.setState({
      price: e.target.value,
    })
  }

  onPaidChange(e) {
    let price_tmp = null;

    if (e.target.value == 'paid') {
      price_tmp = this.refs.price ? this.refs.price.getValue() : this.state.price;
      if (price_tmp == null || price_tmp == '')
        price_tmp = '0';
    }

    this.setState({
      is_priced : e.target.value == 'paid',
      price     : price_tmp,
      version   : this.refs.version.getValue(),
    });
  }


  deleteArticle(e) {
    e.preventDefault();
    this.props.dispatch(closeModal());
    this.props.dispatch(pageEditor.deleteSingleArticle(this.props.router.params.page_id));
  }

  saveSettings(e) {
    e.preventDefault();
    let price_tmp = null;
    if (this.state.is_priced) {
      price_tmp = this.refs.price ? this.refs.price.getValue() : 0;
      if (price_tmp == null || price_tmp == '')
        price_tmp = '0';

        this.setState({ price : price_tmp });
    }

    const price     = price_tmp;
    const version   = this.refs.version.getValue();
    const is_priced = this.state.is_priced;

    this.props.dispatch(pageSummary.handlePageSummaryChange({price, version, is_priced}));

    this.props.dispatch(closeModal());
  }

  getPaidField() {
    // do not render payment options for articles within collections
    if(this.props.router.params.collection_id) return null;

    const paidOptions = [{title: 'paid', value: 'paid'}, {title: 'free', value: 'free'}];
    const paidValue   = this.state.is_priced ? paidOptions[0] : paidOptions[1];

    return <div className='form-group art-setting'>
            <Select name='is_priced' value={paidValue.value}
                    options={paidOptions}
                    changeHandler={this.onPaidChange}/>
           </div>;
  }

  getFields() {

    // do not render payment options for articles within collections
    if(this.state.is_priced && !this.props.router.params.collection_id) {
      return [{
        name : 'price',
        type : 'number',
      }, {
        name : 'version',
        type : 'text',
      }];
    } else {
      return [{
        name : 'version',
        type : 'text',
      }];
    }
  }

}