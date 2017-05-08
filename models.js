const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    type: String,
    required: true
  }
})

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
