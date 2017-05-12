const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const cors = require('cors');
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
	TEST_DATABASE_URL
} = require('../config.js');
const {
	makeGenerator,
	modelGenerator,
	yearGenerator,
	priceGenerator
} = require('../scripts/randomgenerator.js');

chai.use(chaiHttp);

function generateCarPost() {
	return {
		make: makeGenerator(),
		model: modelGenerator(),
		year: yearGenerator(),
		price: priceGenerator(),
	}
}

function seedData() {
	let data = [];
	for (let i = 0; i < 10; i++) {
		data.push(generateCarPost());
	}
	return CarListing.insertMany(data);
}

function tearDownDb() {
	console.warn('Dropping the db');
	return mongoose.connection.dropDatabase();
}

describe('Autos.com testing suite', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function() {
		return seedData();
	});
	afterEach(function() {
		return tearDownDb();
	});
	after(function() {
		return closeServer();
	});

	describe('GET endpoints', function() {
		it('should return the full list of cars available', function() {
			let res;
			return chai.request(app)
				.get('/cars')
				.then(function(_res) {
					res = _res;
					res.should.have.status(200);
					res.should.be.json;
					return CarListing.count();
				})
				.then(function (count) {
					res.body.should.have.length.of(count);
				});
		})
		it('should return car listings with the right fields', function () {
			let resListing;
			return chai.request(app)
				.get('/cars')
				.then(function (res) {
					res.should.be.json;
					res.body.should.be.a('array');
					res.body.forEach(function (car) {
						car.should.be.a('object');
						car.should.include.keys('make', 'model', 'year', '_id', 'price');
					});
					resListing = res.body[0];
					return CarListing.findById(resListing._id);
				})
				.then(function (car) {
					// resListing._id.should.equal(car.id);
					resListing.make.should.equal(car.make);
					resListing.model.should.equal(car.model);
					// resListing.price.should.equal(car.price);
				});
		});
	});
	describe('POST endpoints', function () {
		it('should add a car listing to the db', function () {
			const newPost = generateCarPost();
			return chai.request(app)
				.post('/cars')
				.send(newPost)
				.then(function (res) {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.should.be.json;
					res.body.should.include.keys('make', 'model', 'year', '_id', 'price');
					res.body.should.not.be.null;
					res.body._id.should.equal(res.body._id);
				});
		});
	});

	describe('PUT endpoints', function () {
		it('should update fields you send over', function () {
			const updateData = {
				make: makeGenerator()
			};
			return CarListing
				.findOne()
				.exec()
				.then(function (car) {
					updateData._id = car._id;
					return chai.request(app)
						.put(`/cars/${car._id}`)
						.send(updateData);
				})
				.then(function (res) {
					res.should.have.status(201);
					return CarListing.findById(updateData._id).exec();
				})
				.then(function (car) {
					car.make.should.equal(updateData.make);
				});
		});
	});

	describe('DELETE endpoints', function () {
		it('it should delete car', function () {
			let car;
			return CarListing
				.findOne()
				.exec()
				.then(function (_car) {
					car = _car;
					return chai.request(app)
						.delete(`/cars/${car._id}`)
				})
				.then(function (res) {
					res.should.have.status(204);
					return CarListing.findById(car._id);
				});
		});
	});
});
