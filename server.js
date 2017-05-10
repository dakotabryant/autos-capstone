const express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	cors = require('cors'),
	{
		BasicStrategy
	} = require('passport-http'),
	{
		DATABASE_URL,
		PORT
	} = require('./config.js'),
	{
		CarListing
	} = require('./models.js'),
	{
		makeGenerator,
		modelGenerator,
		yearGenerator,
		priceGenerator
	} = require('./scripts/randomgenerator.js');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
mongoose.Promise = global.Promise;

const strategy = new BasicStrategy(function(username, password, callback) {
	let user;
	User
		.findOne({
			username: username
		})
		.exec()
		.then(_user => {
			user = _user;
			if (!user) {
				return callback(null, false, {
					message: 'Incorrect username'
				});
			}
			return user.validatePassword(password);
		})
		.then(isValid => {
			if (!isValid) {
				return callback(null, false, {
					message: 'Incorrect password'
				});
			} else {
				return callback(null, user)
			}
		});
});

passport.use(strategy);

app.get('/cars', (req, res) => {
	//bound to the first get request
	//shows a list of all the cars in the DB
	//also bound to the "view inventory" button
	//will require user to be logged in
	CarListing
		.find()
		.exec()
		.then(listings => {
			res.status(200).json(listings);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: 'Someone messed up. 🚫 🙅'
			})
		})
})
app.get('/cars/:id', (req, res) => {
	CarListing
		.findById(req.params.id)
		.exec()
		.then(car => {
			res.status(200).json(car);
		})
})

app.post('/cars', (req, res) => {
	//figure out how to send a picture
	//will require user to be logged in
	const requiredFields = ['make', 'model', 'year', 'price']
	for (var i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	CarListing
		.create({
			make: req.body.make,
			model: req.body.model,
			year: req.body.year,
			price: req.body.price,
			photo: req.body.photo
		})
		.then(car => {
			res.json(car);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: 'Someone messed up. 🚫 🙅'
			})
		})
})

const jsonParser = bodyParser.json();

app.put('/cars/:id', jsonParser, (req, res) => {
	//linked to the edit button
	//can edit any field and then save
	//will require user to be logged in
	//confirm the user's submission before they truly submit
	const updatedEntry = {};
	const editableFields = ['make', 'model', 'year', 'price', 'photo'];
	editableFields.forEach(field => {
		if (field in req.body) {
			updatedEntry[field] = req.body[field];
		}
	});
	console.log(updatedEntry);
	CarListing
		.findByIdAndUpdate(req.params.id, {
			$set: updatedEntry
		}, {
			new: true
		})
		.exec()
		.then(car => {
			res.status(201).json(car.apiRepr());
		})
})
app.delete('/cars/:id', (req, res) => {
	//linked to delete button
	//will require user to be logged in
	CarListing
		.findByIdAndRemove(req.params.id)
		.exec()
		.then(() => {
			res.status(204).json('Deleted')
		})
})


app.post('/cars/random', (req, res) => {
  CarListing
  .create({make: makeGenerator(), model: modelGenerator(), year: yearGenerator(), price: priceGenerator(), photo: req.body.photo})
  .then(car => {
    res.status(201).json(car);
  })
})

app.use('*', function(req, res) {
	res.status(404).json({
		message: 'Not Found'
	});
});

let server;


function runServer(databaseUrl = DATABASE_URL, port = PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
					console.log(`Your app is listening on port ${port}`);
					resolve();
				})
				.on('error', err => {
					mongoose.disconnect();
					reject(err);
				});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
};

module.exports = {
	runServer,
	app,
	closeServer
};
