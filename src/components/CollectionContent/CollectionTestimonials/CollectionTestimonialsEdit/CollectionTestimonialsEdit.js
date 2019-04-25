import styles from './CollectionTestimonialsEdit.module.scss';
import React, { Component, PropTypes } from 'react';

const AddTestimonialComponent = require('./AddTestimonial');
const TestimonialBlock = require('./TestimonialBlock');

export default class CollectionTestimonialsEdit extends Component {
  render() {
    const { testimonials } = this.props;

    console.log(testimonials);

    let  testimonials_list = null;
    testimonials_list = testimonials.map((testimonial, index) => {
      return (
        <TestimonialBlock
          key={index}
          testimonial={testimonial}
          index={index}
          onRemoveTestimonial={this.props.onRemoveTestimonial}
        />
      );
    });

    return (
      <div className={styles.testimonials_container}>
        <div className={styles.label}>Testimonials</div>
        { testimonials_list }
        <AddTestimonialComponent onAddTestimonial={this.props.onAddTestimonial}/>
      </div>
    );
  }
}

CollectionTestimonialsEdit.propTypes = {
  testimonials       : PropTypes.array,
  onAddTestimonial   : PropTypes.func,
  onRemoveTestimonial: PropTypes.func,
};

CollectionTestimonialsEdit.defaultProps = {
  testimonials: []
}
