const express = require('express');

const app = module.exports = express();

app.post('/images', function(req, res) {
});

app.get('/images', function(req, res) {
});

app.get('/images/:filename', function(req, res) {
});

app.delete('/images/:filename', function(req, res) {
});
