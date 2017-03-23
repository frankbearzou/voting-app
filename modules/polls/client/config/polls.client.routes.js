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
        controller: 'PollsController',
        controllerAs: 'vm'
      })
      .state('polls-view', {
        url: '/polls/:pollId',
        templateUrl: 'modules/polls/client/views/poll-view.client.view.html',
        controller: 'PollsController'
      });
  }
})();
