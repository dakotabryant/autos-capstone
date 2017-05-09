const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const carListingSchema = mongoose.Schema({
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  photo: {
    type: String
  }
})
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    default: ""
  },
  lastName: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    required: true
  }
})

userSchema.methods.apiRepr = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
}

userSchema.methods.validatePassword = function(password) {
  return bcrypt
    .compare(password, this.password)
    .then(isValid => isValid);
}

userSchema.statics.hashPassword = function(password) {
  return bcrypt
    .hash(password, 10)
    .then(hash => hash);
}

carListingSchema.virtual('makeAndModel').get(function() {
  return `${this.make} ${this.model}`.trim();
});

carListingSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    make: this.makeAndModel,
    year: this.year,
    price: this.price
  }
}
const CarListing = mongoose.model('CarListing', carListingSchema);
module.exports = {CarListing};
