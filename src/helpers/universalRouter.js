import React from 'react';
import qs from 'query-string';
import {match, RoutingContext} from 'react-router';
import Root from '../routes';
import {Provider} from 'react-redux';

export default function universalRouter(location, history, store, preload) {
  return new Promise((resolve, reject) => {
    match({routes, history, location}, (error, redirectLocation, renderProps) => {
      if (error) {
        return reject(error);
      }

      if (redirectLocation) {
        return resolve({
          redirectLocation,
        });
      }

      function resolveWithComponent() {
        // const component = (
          
        // );

        // resolve({
        //   component
        // });
      }

      if (false && preload) {
        fetchDataForContainers(
          renderProps.components,
          store,
          renderProps.params,
          qs.parse(renderProps.location.search)
        )
          .then(() => resolveWithComponent(), err => reject(err));
      } else {
        resolveWithComponent();
      }
    });
  });
}
