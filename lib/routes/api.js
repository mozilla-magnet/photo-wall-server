const express = require('express');
const multer =  require('multer');
const config =  require('../../config.json');
const path = require('path');

const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.upload_directory);
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

const app = module.exports = express();

app.post('/images', upload.single('image'), function(req, res) {
  console.log(req.file);
  res.json({ message: "upload successful" });
});

app.get('/images', function(req, res) {
  if (req.get('accept') === 'text/event-stream') {

  } else {
    fs.readdir(config.upload_directory, (err, files) => {
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
