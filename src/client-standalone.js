import React from 'react';
import {render} from 'react-dom';

import Page from './component-standalone';

const dest = document.getElementById('app-container');

/* Initializing touch events */
React.initializeTouchEvents(true);

window.createEducativeJottedInstance = function(content) {
  React.render((
    <Page content={content}/>
    ), dest
  );
};
