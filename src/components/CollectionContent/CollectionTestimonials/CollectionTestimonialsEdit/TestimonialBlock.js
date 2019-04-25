import styles from './CollectionTestimonialsEdit.module.scss';
import React, { Component, PropTypes } from 'react';
import { Btn } from '../../../';


export default class TestimonialBlock extends Component {
  getRow(key, value) {
    return (
      <div className={styles.testimonial_row}>
        <div className={styles.testimonial_key}>{key}</div>
        <div className={styles.testimonial_value}>{value}</div>
      </div>
    );
  }

  render() {
    const { testimonial } = this.props;

    return (
      <div className={styles.testimonial_block}>
        {
          this.getRow('Name', testimonial.name)
        }
        {
          this.getRow('Title', testimonial.title)
        }
        {
          this.getRow('Testimonial', testimonial.text)
        }
        <Btn small primary
          className={styles.remove_button}
          onClick={() => this.props.onRemoveTestimonial(this.props.index)}
          text="Remove Testimonial"
        />
      </div>
    );
  }
}

TestimonialBlock.propTypes = {
  testimonial : PropTypes.shape({
    name  : PropTypes.string.isRequired,
    title : PropTypes.string.isRequired,
    text  : PropTypes.string.isRequired
  }).isRequired,
  index               : PropTypes.number.isRequired,
  onRemoveTestimonial : PropTypes.func.isRequired,
};
