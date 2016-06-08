'use strict';

const config = require('./config.json');
const app = require('./lib/app');

const port = process.env.PORT || config.default_port;
const address = process.env.ADDRESS || config.address || '';
const server = app.listen(port, address, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`photo wall service listening at http://${host}:${port}`);
});
