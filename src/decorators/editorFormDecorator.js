import React, {Component, PropTypes} from 'react';

export default function (formType) {

  return function(Form) {
    class EditorForm extends Component {

      static PropTypes = {
        data : PropTypes.object.isRequired,
        name : PropTypes.string.isRequired,
        mode : PropTypes.string.isRequired,
        globalAction : PropTypes.string,
        saveFormData : PropTypes.func,
        resetGlobalAction : PropTypes.func.isRequired,
      };

      constructor(props) {
        super(props);

        this.onPaidChange    = this.onPaidChange.bind(this);
        this.saveFieldOnBlur = this.saveFieldOnBlur.bind(this);
        this.onTagsChange    = this.onTagsChange.bind(this);
        this.onSubmitFrom    = this.onSubmitFrom.bind(this);

        this.state = {
          errors : [],
        };
      }

      componentDidMount() {
        const firstInputNode = document.forms[this.props.name].elements[0];

        firstInputNode.focus();
      }

      componentWillReceiveProps(nextProps, nextState) {

        if(nextProps.globalAction == this.props.globalAction) return;

        if(nextProps.globalAction == 'save' ||
           nextProps.globalAction == 'publish' ||
           nextProps.globalAction == 'preview') {
          if(this.validateForm()) {
            this.onSubmitFrom();
          } else {
            this.props.resetGlobalAction();
          }
          return;
        }

      }

      render() {

        const methods = {
          changePaid      : this.onPaidChange,
          saveFieldOnBlur : this.saveFieldOnBlur,
          changeTags      : this.onTagsChange,
          saveForm        : this.onSubmitFrom,
        }

        const props = {...this.props, ...this.state, ...methods};

        delete props.saveFormData;
        delete props.globalAction;

        return <Form {...props}/>;
      }

      onSubmitFrom(e) {
        if(e) e.preventDefault();

        const formNode = document.forms[this.props.name];
        const elementsCount = formNode.elements.length;

        let data = {};
        for(let i = 0; i < elementsCount; i++) {
          if(!formNode.elements[i].name) break;

          data[formNode.elements[i].name] = formNode.elements[i].value;
        }

        data.is_priced = data.is_priced == 'paid';

        if (this.props.data) {
          data.details = this.props.data.details || '';
        }

        this.props.saveFormData(data);
      }

      saveFieldOnBlur(e) {
        let name  = e.target.name;
        let value = e.target.value;

        if(value == this.props.data[name] && name != 'price') return;

        // don't save if no changes in field except for price

        let data = {};

        data[name] = value;

        this.cleanErrors();
        this.props.saveFormData(data);
      }

      onTagsChange(tags) {
        this.cleanErrors();
        this.props.saveFormData({tags});
      }

      onPaidChange(e) {
        const is_priced = e.target.value == 'paid';

        this.cleanErrors();
        this.props.saveFormData({is_priced});
      }

      cleanErrors() {
        this.setState({
          errors : [],
        });
      }

      validateForm() {
        let errors = [];

        const formNode = document.forms[this.props.name];
        const elementsCount = formNode.elements.length;
        const rules    = this.getValidationRules();

        const validateElement = function(element) {

          rules.forEach( rule => {
            if(element.name !== rule.field) return;

            if(!rule.checker(element.value)) {
              errors.push(rule.field);
            }
          });
        }

        for(let i = 0; i < elementsCount; i++) {
          const element = formNode.elements[i];

          if(!element.name) continue;
          validateElement(element);
        }

        if(errors.length)
          this.setState({
            errors,
          });

        return errors.length ? false : true;
      }

      getValidationRules() {
        return {
          collection: [{
            field   : 'title',

            checker : (title) => {
              if(!title) return false;

              if(title.length > 256) return false;

              return true;
            },
          }, {
            field   : 'summary',

            checker : (summary) => {
              if(!summary) return false;

              if(summary.length > 1024) return false;

              return true;
            },
          }, {
            field   : 'details',
            checker : (details) => details.length < 16*1024,
          }, {
            field   : 'intro_video_url',
            checker : (intro_video_url) => {
              return true;
            },
          }, {
            field   : 'price',

            checker : (price) => {
              if(isPriced(this.props.name)) {
                if(!price) return false;
                if(price.indexOf('.') !== -1) return false;
              }

              return true;
            },
          }],
        }[formType];
      }


    }

    return EditorForm;
  }
}

function isPriced(formName) {
  const is_priced = document.forms[formName].elements.is_priced.value;

  return is_priced == 'paid';
}
