import styles from './Testimonials.module.scss';

import React, { Component } from 'react';
import { Carousel } from 'react-bootstrap';

const Testimonials = () => {
    return (
      <div className={styles.testimonials_wrapper}>
        <Carousel indicators={false} controls={false}>
          <Carousel.Item>
            <div className={styles.testimonial_wrapper}>
              <div className={styles.testimonial_text}>
                  What you all have put together is the most practical study material I've encountered period. My biggest desire has been to have a resource that explains the solutions step-by-step in a visual manner.  You guys absolutely nailed it.
              </div>
              <img className={styles.testimonial_image}  src="/imgs/customers/cs1.jpg" />
              <div className={styles.testimonial_name_title}>
                <p>Samuel Mendenhall</p>
                <p>Senior Software Engineer</p>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className={styles.testimonial_wrapper}>
              <div className={styles.testimonial_text}>
                  Due to Educative, I was able to give my book an interactive playground to offer students a richer learning experience. Learning programming is about trying things out actively, rather than consuming it passively.
              </div>
              <img className={styles.testimonial_image}  src="/imgs/customers/cs3.jpeg" />
              <div className={styles.testimonial_name_title}>
                <p>Robin Wieruch</p>
                <p>Author of The Road to Learn React</p>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className={styles.testimonial_wrapper}>
              <div className={styles.testimonial_text}>
                  Brilliantly simple yet extremely powerful platform for learning! If you are a visual thinker, like me, you'll find educative's way of explaining concepts to be much easier to understand, retain and recall later.
              </div>
              <img className={styles.testimonial_image}  src="/imgs/customers/cs2.jpg" />
              <div className={styles.testimonial_name_title}>
                <p>Umer Azad</p>
                <p>Senior Software Engineer @ Uber</p>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>
    );
}

// class Testimonials extends Component {
//   render() {
//     return (
//       <div className="row" style = {{ backgroundColor: '#f7f7f4' }}>
//         <div className="container text-center" style={{ paddingTop:'30px', paddingBottom:'30px', backgroundColor: '#f7f7f4' }}>
//           {/* <h2 style = {{ marginBottom: '20px'}}>People are using our platform to learn</h2>*/}
//           <div className="col-md-6 col-sm-6 text-center">
//             <div className={styles.testimonial_text}>
//                 What you all have put together is the most practical study material I've encountered period. My biggest desire has been to have a resource that explains the solutions step-by-step in a visual manner.  You guys absolutely nailed it.
//             </div>
//             <img className={styles.testimonial_image}  src="/imgs/customers/cs1.jpg" />
//             <div className={styles.testimonial_name_title}>
//               <p>Samuel Mendenhall</p>
//               <p>Senior Software Engineer</p>
//             </div>
//           </div>
//           <div className="col-md-6 col-sm-6 text-center">
//             <div className={styles.testimonial_text}>
//               Brilliantly simple yet extremely powerful platform for learning! If you are a visual thinker, like me, you'll find educative's way of explaining concepts to be much easier to understand, retain and recall later.
//             </div>
//             <img className={styles.testimonial_image} src="/imgs/customers/cs2.jpg" />
//             <div className={styles.testimonial_name_title}>
//               <p>Umer Azad</p>
//               <p>Senior Software Engineer @ Uber</p>
//             </div>
//           </div>
//         </div>
//       </div>);
//   }
// }



export default Testimonials;
