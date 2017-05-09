const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const {BasicStrategy} = require('passport-http');
const {DATABASE_URL, PORT} = require('./config.js');
const {CarListing} = require('./models.js');

const app = express();

app.use(bodyParser.json());

mongoose.Promise = global.Promise;

const strategy = new BasicStrategy(function(username, password, callback) {
  let user;
  User
    .findOne({username: username})
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return callback(null, false, {message: 'Incorrect username'});
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return callback(null, false, {message: 'Incorrect password'});
      }
      else {
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
    res.status(500).json({error: 'Someone messed up. 🚫 🙅'})
  })
})

app.post('/create-car', (req, res) => {
  //figure out how to send a picture
  //will require user to be logged in
  CarListing
  .create({make: req.body.make, model: req.body.model, year: req.body.year, price: req.body.price, photo: req.body.photo})
  .then(car => {
    res.json(car);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: 'Someone messed up. 🚫 🙅'})
  })
})
app.put('/cars/:id', (req, res) => {
  //edits the specified car
  //linked to the edit button
  //can edit any field and then save
  //will require user to be logged in
  //confirm the user's submission before they truly submit
})
app.delete('/cars/:id', (req, res) => {
  //deletes the specified car
  //linked to delete button
  //will require user to be logged in
})









app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
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

module.exports = {runServer, app, closeServer};
