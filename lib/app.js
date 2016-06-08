'use strict';

const express = require('express');
const morgan = require('morgan');

module.exports = express()
  .use(morgan('combined'))
  .use('/api/v1/', require('./routes/api'))
  .use('/', require('./routes/frontend'));
