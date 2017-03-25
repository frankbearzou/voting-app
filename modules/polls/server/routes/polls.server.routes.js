'use strict';

var polls = require('../controllers/polls.server.controller');

module.exports = function(app) {
  // Routing logic
  // query
  app.route('/api/polls').get(polls.list);

  // query my polls
  app.route('/api/mypolls').get(polls.list_my_polls);

  // get
  app.route('/api/polls/:pollId').get(polls.read);

  // delete
  app.route('/api/polls/:pollId').delete(polls.delete);

  // create
  app.route('/api/polls').post(polls.create);

  // vote
  app.route('/api/polls/vote').post(polls.vote);
};
