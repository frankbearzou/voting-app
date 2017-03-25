'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Poll = mongoose.model('Poll'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Poll
 */
exports.create = function (req, res) {
  let params = req.body;
  const owner = req.user.username;

  let options = [];
  params.options.forEach(option => options.push({ name: option, count: 0 }));

  const poll = new Poll({
    owner,
    title: params.title,
    options
  });

  poll.save(function (err, poll, numAffected) {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: err
      });
    } else {
      res.json({
        'message': 'success'
      });
    }
  });
};

/**
 * Show the current Poll
 */
exports.read = function (req, res) {
  const pollId = req.params.pollId;
  console.log('pollId: ', pollId);

  Poll.findById(pollId).exec(function(err, poll) {
    if (err) {
      res.status(500).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log('poll: ', poll);
      res.json(poll);
    }
  });
};

/**
 * Update a Poll
 */
exports.update = function (req, res) {
  const pollId = req.params.pollId;
  const username = req.user.username;

  Poll.findOneAndRemove({ _id: pollId, owner: username }, function (err, doc) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (doc.result.n === 0) {
        return res.status(400).send({
          message: 'error: you do not have right to delete this poll!'
        });
      } else {
        res.json({ message: 'success' });
      }
    }
  });
};

/**
 * Delete an Poll
 */
exports.delete = function (req, res) {
  const pollId = req.params.pollId;
  const owner = req.user.username;

  Poll.findOneAndRemove({ _id: pollId, owner:  owner }, function (err, poll) {
    if (err) {
      return res.status(500).send({
        message: err.error
      });
    } else {
      res.json({ message: 'success' });
    }
  });
};

/**
 * List of Polls
 */
exports.list = function (req, res) {
  Poll.find().sort('-created').select('title').exec(function(err, polls) {
    if (err) {
      console.log('error:!!!!!!!!!!');
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log('polls: ', polls);
      res.json(polls);
    }
  });
};

/**
 * List of my Polls
 */
exports.list_my_polls = function (req, res) {
  const username = req.user.username;
  Poll.find({ 'owner': username }).sort('-created').select('title').exec(function(err, polls) {
    if (err) {
      console.log('error:!!!!!!!!!!');
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log('polls: ', polls);
      res.json(polls);
    }
  });
};

exports.vote = function (req, res) {
  const ip = req.ip;
  console.log('ip: ', ip);

  const username = req.user.username;
  console.log('user: ', username);

  const _id = req.body._id;
  console.log('_id: ', _id);

  const option = req.body.option;
  console.log('option: ', option);

  const newOption = req.body.newOption;
  console.log('newOption: ', newOption);

  Poll.findOne({
    _id: _id,
    votedBy: new RegExp('^' + username + '$|^' + ip + '$', 'i')
  }).exec(function (err, poll) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // return error message if votedBy has username or ip
      // preventing duplicate voting
      if (poll) {
        console.log('Error: You can only vote once a poll. [user-or-ip-voted]');
        return res.status(500).send({
          message: 'Error: You can only vote once a poll. [user-or-ip-voted]'
        });
      } else {
        console.log('can vote');

        // if vote for old option
        if (option) {
          console.log('option1: ', option);
          Poll.findOneAndUpdate({
            _id: _id,
            'options.name': option
          }, {
            $inc: { 'options.$.count': 1 },
            $push: { 'votedBy': { $each: [username, ip] } }
          }, function (err, poll) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.json({
                message: 'voted success'
              });
            }

          });
        }
        // if vote for new option
        else {
          console.log('option2: ', option);
          Poll.findOneAndUpdate({
            _id: _id
          }, {
            $push: {
              'options':  { 'name': newOption, 'count': 1 },
              'votedBy': { $each: [username, ip] }
            },
          }, function (err, poll) {
            if (err) {
              console.log('here: ', err);
              return res.status(400).send({
                message: err.message
              });
            } else {
              res.json({
                message: 'voted success'
              });
            }
          });
        }
      }
    }
  });
};
