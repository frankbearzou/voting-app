'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Polls Schema
 */
var PollSchema = new Schema({
  // Polls model fields
  owner: {
    type: String,
    required: 'Please fill Poll name',
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  options: [{
    _id: false,
    name: {
      type: String,
      required: 'option name',
      trim: true
    },
    count: {
      type: Number,
      required: 'count',
      default: 1,
      min: 0
    }
  }],
  votedBy: [String],
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Poll', PollSchema);
