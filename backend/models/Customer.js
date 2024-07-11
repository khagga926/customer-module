const mongoose = require('mongoose');

const contactPersonSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  first_name: { type: String, required: true, maxlength: 50 },
  last_name: { type: String, required: true, maxlength: 50 },
  email: {
    type: String,
    required: true,
    maxlength: 50,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  mobile_phone: { type: String, required: true, maxlength: 20 },
  birth_date: { type: String, required: true },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    default: null,
  },
});

const addressSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  company_name: { type: String, maxlength: 50 },
  last_name: { type: String, maxlength: 50 },
  country: { type: String, required: true, maxlength: 50 },
  zip: { type: String, required: true, maxlength: 20 },
  city: { type: String, required: true, maxlength: 50 },
  fax: { type: String, maxlength: 20 },
  phone: { type: String, maxlength: 20 },
  street: { type: String, required: true, maxlength: 100 },
  email: {
    type: String,
    maxlength: 50,
    validate: {
      validator: function (v) {
        if (
          this.parent().type === 'COMPANY' ||
          this.parent().type === 'DEALER'
        ) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        }
        return !v; // Email should be empty or null if type is PRIVATE
      },
      message: (props) =>
        `Email should only be set if type is COMPANY or DEALER`,
    },
    default: function () {
      return this.parent().type === 'PRIVATE' ? null : '';
    },
  },
});

const customerSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  intnr: { type: String, required: true, unique: true, maxlength: 10 },
  type: {
    type: String,
    required: true,
    enum: ['PRIVATE', 'COMPANY', 'DEALER'],
  },
  contact_persons: {
    type: [contactPersonSchema],
    validate: [arrayLimit, '{PATH} cannot be empty'],
  },
  addresses: {
    type: [addressSchema],
    validate: [arrayLimit, '{PATH} cannot be empty'],
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

function arrayLimit(val) {
  return val.length > 0;
}

module.exports = mongoose.model('Customer', customerSchema);
