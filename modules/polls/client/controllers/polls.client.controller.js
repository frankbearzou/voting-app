(function() {
  'use strict';

  angular
    .module('polls')
    .controller('PollsController', PollsController);

  PollsController.$inject = ['$scope', '$state', '$stateParams', '$http', '$window', 'Authentication'];

  function PollsController($scope, $state, $stateParams, $http, $window, Authentication) {
    var vm = this;

    $scope.authentication = Authentication;

    // Polls controller logic
    $scope.list = function () {
      $http.get('/api/polls').then(function (response) {
        $scope.polls = response.data;
        console.log(response.data);
      });
    };

    //
    $scope.read = function () {
      var pollId = $stateParams.pollId;

      var labels = [];
      var data = [];

      $http.get('/api/polls/' + pollId).then(function (response) {
        $scope.poll = response.data;
        console.log(response.data);
        console.log($scope.poll);
      }).then(function () {
        $scope.poll.options.forEach(function (obj) {
          labels.push(obj.name);
          data.push(obj.count);
        });
      }).then(function () {
        $scope.labels = labels;
        $scope.data = data;
      });

      $scope.error = null;
      $scope.form = {};
      // $scope.remove = remove;
      // $scope.save = save;

      $scope.options = {
        title: {
          text: 'result',
          display: true
        },
        legend: {
          display: true,
          position: 'bottom'
        }
      };
    };

    // vote
    $scope.vote = function (ev) {
      var pollId = $stateParams.pollId;
      var selectedOption = $scope.selectedOption;
      var voteforCustom = $scope.voteforCustom;


      if (!selectedOption || (selectedOption === '===custom-option' && !voteforCustom)) {
        $window.alert('You must choose which option to vote for.');
        return false;
      }

      if (selectedOption === '===custom-option') {
        selectedOption = undefined;
      }

      var params = {
        _id: pollId,
        option: selectedOption,
        newOption: voteforCustom
      };

      $http.post('api/polls/vote', params).success(function (data, status) {
        $state.reload();
      }).error(function (data, status) {
        console.log('err: ', data, status);
        $window.alert(data.message);
      });

      console.log('pollId: ', pollId);
      console.log('selectedOption: ', selectedOption);
      console.log('voteforCustom: ', voteforCustom);

    };
  }
})();
