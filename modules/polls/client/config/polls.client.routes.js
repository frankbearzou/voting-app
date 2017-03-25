(function () {
  'use strict';

  //Setting up route
  angular
    .module('polls')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Polls state routing
    $stateProvider
      .state('polls-list', {
        url: '/polls/polls-list',
        templateUrl: 'modules/polls/client/views/polls.client.view.html',
        controller: 'PollsController'
      })
      .state('polls-my-polls', {
        url: '/polls/polls-my-polls',
        templateUrl: 'modules/polls/client/views/polls-my-polls.client.view.html',
        controller: 'PollsController'
      })
      .state('polls-create', {
        url: '/polls/polls-create',
        templateUrl: 'modules/polls/client/views/polls-create.client.view.html',
        controller: 'PollsController'
      })
      .state('polls-view', {
        url: '/polls/:pollId',
        templateUrl: 'modules/polls/client/views/poll-view.client.view.html',
        controller: 'PollsController'
      });
  }
})();
