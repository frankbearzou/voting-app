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
    name: {
      type: String,
      required: 'option name',
      trim: true
    },
    count: {
      type: Number,
      required: 'count',
      default: 1,
      min: 1
    }
  }],
  votedBy: [String],
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Poll', PollSchema);
