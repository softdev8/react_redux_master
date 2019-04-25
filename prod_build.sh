#!/bin/bash
printf "\n Building Educative for Production \n\n"

NODE_ENV=production webpack --verbose --colors --display-error-details --config webpack.prod.config.js
