import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom';

export default {
  create: (Modal, componentToRender) => {
    $('body').addClass('modal-open').append("<div class='modal-backdrop fade in'></div>").append("<div id='modal-container'></div>");

    const component = render(<Modal componentToRender={componentToRender} />, document.getElementById('modal-container'));
    component.open();
  },
  remove: () => {
    $('html, body').css('overflow', '');
    unmountComponentAtNode(document.getElementById('modal-container'));
    $('body').find('>#modal-container').remove();
  }
};