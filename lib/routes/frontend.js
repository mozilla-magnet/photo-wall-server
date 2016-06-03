const express = require('express');
const homepage = require('../../package.json').homepage;

module.exports = express()
    .get('/', (req, res) => res.redirect(homepage));
