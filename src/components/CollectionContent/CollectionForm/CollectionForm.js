import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';

import { LabelledInput, SimplePriceInput, Select, Tags } from '../../index';
import { CollectionDetails } from '../../../containers';

import editorFormDecorator from '../../../decorators/editorFormDecorator';

@editorFormDecorator('collection')
class CollectionForm extends Component {

  static propTypes = {
    data   : PropTypes.object.isRequired,
    name   : PropTypes.string.isRequired,
    mode   : PropTypes.string.isRequired,
    errors : PropTypes.array,
    changePaid      : PropTypes.func.isRequired,
    saveFieldOnBlur : PropTypes.func.isRequired,
    changeTags      : PropTypes.func.isRequired,
    saveForm        : PropTypes.func.isRequired,
    globalAction    : PropTypes.string,
  };

  isError(field) {
    const { errors = [] } = this.props;

    return errors.indexOf(field) !== -1;
  }

  render() {

    const { data = {}, name = 'form', mode } = this.props;
    const baseClassName = 'editor-form';

    const className = baseClassName;

    const paidOptions = [{ title: 'paid', value: 'paid' }, { title: 'free', value: 'free' }];
    const paidValue   = data.is_priced ? paidOptions[0] : paidOptions[1];
    const paidSelect  = mode === 'write' ? <Select changeHandler={this.props.changePaid} name="is_priced" value={paidValue.value} options={paidOptions}/>
                                         : paidValue.title;
    let price = '';

    if (!data.price && data.is_priced) price = '0';
    if (data.price && data.is_priced)  price = data.price;

    return (
      <div className={className}>

        <form className="form-horizontal" ref={name} name={name} onSubmit={this.props.saveForm}>

          <LabelledInput label="Title" help="Max 256 chars"
            name="title"
            disabled={mode === 'read'}
            handleBlur={this.props.saveFieldOnBlur}
            isError={this.isError('title')}
            required
            value={data.title}
          />

          <LabelledInput type="textarea" label="summary" help="Max 1024 chars"
            name="summary"
            disabled={mode === 'read'}
            isError={this.isError('summary')}
            required
            handleBlur={this.props.saveFieldOnBlur}
            value={data.summary}
          />

          <LabelledInput type="textarea" label="details" help="Max 1024 chars"
            disabled={mode === 'read'} ref="details" name="details"
            value={data.details || ''}
          >
            <CollectionDetails initialValue={data.details || ""}/>
          </LabelledInput>

          <Row>
            <Col xs={6}>
              <LabelledInput
                label="version"
                help="From 0 - Infinity"
                name="author_version"
                mode={mode}
                handleBlur={this.props.saveFieldOnBlur}
                value={data.author_version}
              />
            </Col>
            <Col xs={6}>
              <Col xs={data.is_priced ? 6 : 12} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                <SimplePriceInput
                  label={paidSelect}
                  name="price"
                  disabled={mode === 'read' || !data.is_priced}
                  groupClass={`form-group form-group-lg b-input-with-label`}
                  type="number"
                  minPrice="0"
                  maxPrice="999"
                  isError={this.isError('price')}
                  onBlur={this.props.saveFieldOnBlur}
                  value={price}
                />
              </Col>
              {data.is_priced ?
                <Col xs={6} style={{  paddingLeft: '0px', paddingRight: '0px' }}>
                  <div className="form-group form-group-lg b-input-with-label">
                    <SimplePriceInput
                      placeholder="Promotional Price"
                      name="discounted_price"
                      mode={mode}
                      minPrice="0"
                      maxPrice="999"
                      disabled={mode === 'read' || !data.is_priced}
                      isError={this.isError('discounted_price')}
                      onBlur={this.props.saveFieldOnBlur}
                      value={data.discounted_price === null ? '' : data.discounted_price}
                    />
                  </div>
                </Col> : null }
            </Col>
          </Row>

          <LabelledInput label="Video" help="Introductory Video"
            placeholder="Youtube or Vimeo link e.g. https://youtu.be/IYvAuFR0r_0"
            disabled={mode === 'read'}
            ref="intro_video_url"
            name="intro_video_url"
            handleBlur={this.props.saveFieldOnBlur}
            value={data.intro_video_url}
            isError={this.isError('intro_video_url')}
          />

           <LabelledInput help={`Separate by commas.\n3 tags maximum.\n3 character min\nand 24 max`}
            label="tags"
            disabled={mode === 'read'}
          >
            <Tags tags={data.tags} ref="tags" mode={mode} maxTags={5} onChange={this.props.changeTags}/>
          </LabelledInput>
        </form>
      </div>
    );
  }

}

export default CollectionForm;
