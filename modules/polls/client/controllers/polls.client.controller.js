(function() {
  'use strict';

  angular
    .module('polls')
    .controller('PollsController', PollsController);

  PollsController.$inject = ['$scope', '$state', '$stateParams', '$http', '$window', '$location', 'Authentication'];

  function PollsController($scope, $state, $stateParams, $http, $window, $location, Authentication) {
    var vm = this;

    $scope.authentication = Authentication;

    // create a new poll
    $scope.create = function (isValid) {
      if (!isValid) {
        console.log('invalid');
        return false;
      }

      var title = $scope.title;
      var options = $scope.options;

      console.log('original options: ', options);
      options = options.split("\n");
      console.log('new options: ', options);

      var params = {
        title: title,
        options: options
      };

      $http.post('/api/polls', params).then(function (response) {
        var pollId = response.data.pollId;
        $state.go('polls-my-polls');
      });
    };

    // list all polls
    $scope.list = function () {
      $http.get('/api/polls').then(function (response) {
        $scope.polls = response.data;
        console.log(response.data);
      });
    };

    // list my polls
    $scope.list_my_polls = function () {
      $http.get('/api/mypolls').then(function (response) {
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
        // set data for charts
        $scope.labels = labels;
        $scope.data = data;
      }).then(function () {
        // set data for sharing
        $scope.url = 'https://twitter.com/share?url=' + $location.absUrl() +
          '&text=' + encodeURIComponent('share polls ' +
            $scope.poll.title);
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

    $scope.delete = function () {
      var pollId = $stateParams.pollId;

      if (confirm('Do you want to delete this post?')) {
        $http.delete('/api/polls/' + pollId).then(function (response) {
          $state.go('polls-list');
        }, function (data, status) {
          $window.alert(data.message);
        });
      }


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
