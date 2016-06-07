'use strict';
const chakram = require('chakram'), expect = chakram.expect;
const fs = require('mz/fs');

describe('Photo-wall server tests', function() {

  const URL = 'http://localhost:3003';
  let listImages;
  let imagesStored;
    
  before(function() {
    fs.readdir('./testuploads').then(listing => {
      imagesStored = listing;})
      .catch(err => console.error(err));
  });

  it('Get the list of images', function() {
    return chakram.get(URL + '/api/v1/images')
    .then(function(response) {
      expect(response).to.have.status(200);
      expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
      listImages = response.body;
      expect(listImages.length).to.be.equal(imagesStored.length);
      expect(response).to.have.json(imagesStored);
    });
  });
});
