const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
chai.should();
const {
	runServer,
  app,
  closeServer
} = require('../server.js');
const {
	CarListing
} = require('../models.js');
const {
	DATABASE_URL
} = require('../config.js');

chai.use(chaiHttp);

describe('Autos.com testing suite', function() {

		describe('GET endpoints', function() {
			it('should return the full list of cars available', function() {
				return chai.request(app)
				.get('/cars')
				.then(function(res) {
					res.status.should.be(200);
				})
				.done();
			})
		});
});
