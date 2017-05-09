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

function seedData() {
  let data = [];
  for (let i = 0; i < 10; i++) {
    data.push(generateCarPost());
  }
  return BlogPost.insertMany(data);
}

describe('Autos.com testing suite', function() {
	before(function () {
		return runServer(DATABASE_URL);
	});
	beforeEach(function () {
		return Promise.all([seedData(), seedUserData()]);
	});
	afterEach(function () {
		return tearDownDb();
	});
	after(function () {
		return closeServer();
	});

		describe('GET endpoints', function() {
			it('should return the full list of cars available', function() {
				return chai.request(app)
				.get('/cars')
				.then(function(res) {
					res.status.should.be(200);
				})
			})
		});
});
