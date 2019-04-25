import styles from './CollectionTestimonialsEdit.module.scss';
import React, { Component, PropTypes } from 'react';
import { Btn } from '../../../';
import Textarea from 'react-textarea-autosize';

export default class AddTestimonialComponent extends Component {
  constructor(props) {
    super(props);

    this.onAddTestimonial = this.onAddTestimonial.bind(this);

    this.state = {
      text: '',
      name: '',
      title: ''
    };
  }

  onAddTestimonial() {
    const { text, name, title } = this.state;

    this.props.onAddTestimonial({
      name,
      title,
      text
    });

    this.setState({
      text: '',
      name: '',
      title: ''
    });
  }

  render() {
    return (
      <div className={styles.add_testimonial_container}>
        <div>
          <label className={styles.testimonial_label}>Name</label>
          <Textarea
            className={styles.testimonial_input}
            maxLength={255}
            minRows={1}
            maxRows={1}
            value={this.state.name}
            onChange={(e) => this.setState({ name: e.target.value })}
          />
          <label className={styles.testimonial_label}>Title</label>
          <Textarea
            className={styles.testimonial_input}
            maxLength={255}
            minRows={1}
            maxRows={1}
            value={this.state.title}
            onChange={(e) => this.setState({ title: e.target.value })}
          />
          <label className={styles.testimonial_label}>Testimonial</label>
          <Textarea
            className={styles.testimonial_input}
            maxLength={4000}
            minRows={2}
            value={this.state.text}
            onChange={(e) => this.setState({ text: e.target.value })}
          />
        </div>
        <Btn small secondary
          className={styles.testimonial_add_button}
          onClick={this.onAddTestimonial}
          text="Add testimonial"
        />
      </div>
    );
  }
}

AddTestimonialComponent.propTypes = {
  onAddTestimonial: PropTypes.func.isRequired
};
