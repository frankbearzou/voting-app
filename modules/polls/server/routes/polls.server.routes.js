'use strict';

var polls = require('../controllers/polls.server.controller');

module.exports = function(app) {
  // Routing logic
  // query
  app.route('/api/polls').get(polls.list);

  // get
  app.route('/api/polls/:pollId').get(polls.read);

  // vote
  app.route('/api/polls/vote').post(polls.vote);
};
