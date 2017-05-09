const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
chai.should();

const {
	runServer,
  app,
  closeServer
} = require('../server');
const {
	CarListing
} = require('../models');
const {
	DATABASE_URL
} = require('../config.js');

chai.use(chaiHttp);

describe('Autos.com testing suite', function() {
    it('true should be true', function() {
      return true.should.be.true;
    });
});
