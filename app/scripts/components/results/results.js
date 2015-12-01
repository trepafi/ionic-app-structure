'use strict';

/**
 * @ngdoc function
 * @name lubertapp.components.results
 * @description
 * # Main Controller
 */
angular.module('lubertapp')
  .controller('ResultsCtrl', function($scope, $ionicModal, artistsSvc) {
    // console.log(artistsSvc.getAll());
    $scope.state = 'list';
    $scope.artists = [];
    $scope.setState = setState;
    $scope.showFilter = showFilter;
    init();

    $scope.$watch('state', function(value) {

    });

    function init() {
      artistsSvc.getAll().then(function(response) {
        console.log(response);
        $scope.artists = response.artists;
      });

      $ionicModal.fromTemplateUrl('templates/components/results/filter.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.filterModal = modal;
      });
    }

    function setState(state) {
      $scope.state = state;
     };

    function showFilter() {
      $scope.filterModal.show();
    }


  });
