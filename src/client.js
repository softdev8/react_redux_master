/**
* THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
*/
import 'babel/polyfill';
import React from 'react';
import {render} from 'react-dom';
import queryString from 'query-string';
import ApiClient from './helpers/ApiClient';
import Root from './routes';
import $ from "jquery";
import Pace from "pace";

const dest = document.getElementById('app-container');
const search = document.location.search;
const query = search && queryString.parse(search);

const removeFadeOut = ()=> {
  setTimeout(()=> {
    $('body').removeClass('fade-out');
  }, 500);
};

require('./preloader.js');

Pace.once('hide', function () {
  $('#pace-loader').removeClass('pace-big').addClass('pace-small');
});

Pace.restart();

if (window.hasOwnProperty('ga') && typeof window.ga === 'function') {
  window.ga(
    'send',
    'pageview',
    {
      page: window.location.pathname + window.location.search + window.location.hash,
    },
  );
}

render(
  <Root/>,
  dest,
  removeFadeOut
);

/**
* This is just a check that we had prerendered app on server just fine, disabled in production
*/
if (process.env.NODE_ENV !== 'production') {
  const reactRoot = window.document.getElementById('content');


  // uncomment when will use server-side rendering
  // if (!reactRoot || !reactRoot.firstChild || !reactRoot.firstChild.attributes || !reactRoot.firstChild.attributes['data-react-checksum']) {
  //   console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  // }
}
