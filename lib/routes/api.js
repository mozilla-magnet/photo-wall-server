'use strict';

const config =  require('../../config.json');
const SSEClient = require('sse').Client;
const express = require('express');
const multer =  require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.upload_directory);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()} - ${file.originalname}`);
  }
});

const upload = multer({ storage: storage });
const app = module.exports = express();

let registeredListenerNextId = 0;
const registeredListeners = {};

// enable cors for all requests
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/images', upload.single('image'), function(req, res) {
  res.json({ message: 'upload successful' });
  process.nextTick(function() {
    Object.keys(registeredListeners).forEach((clientId) => {
      registeredListeners[clientId].send('newimage', req.file.filename);
    });
  });
});

app.get('/images', function(req, res, next) {
  if (req.get('accept') === 'text/event-stream') {
    const client = new SSEClient(req, res);
    const clientId = registeredListenerNextId++;

    client.on('close', () => {
      delete registeredListeners[clientId];
    });

    registeredListeners[clientId] = client;

    client.initialize();
  } else {
    fs.readdir(config.upload_directory, (err, files) => {
      if (err) {
        return next(err);
      }

      // ignore hidden files
      files = files.filter(file => !file.startsWith('.'));

      res.json(files.sort());
    });
  }
});

app.get('/images/:filename', function(req, res) {
  const filename = req.params.filename;
  const sanitisedFilename = path.join(config.upload_directory,
            path.join('/', path.normalize(filename)));

  fs.createReadStream(sanitisedFilename).pipe(res);
});

app.delete('/images/:filename', function(req, res) {
  const filename = req.params.filename;
  const sanitisedFilename = path.join(config.upload_directory,
            path.join('/', path.normalize(filename)));

  fs.unlink(sanitisedFilename, () => {
    res.json({ message: "deleted" });
  });
});


// Set up an interval, to send a keep alive message to connected
// EventSources
const interval = setInterval(() => {
    Object.keys(registeredListeners).forEach((clientId) => {
      registeredListeners[clientId].send('keepalive', '1');
    });
}, config.keep_alive_interval);

interval.unref();
