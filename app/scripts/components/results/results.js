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
    resetVars();
    init();

    function resetVars() {
      $scope.state = 'list';
      $scope.artists = [];
      $scope.setState = setState;
      $scope.showFilter = showFilter;

      var ratingRange = {
        min: 0,
        max: 100
      };

      var ageRange = {
        min: 16,
        max: 74
      }

      $scope.ratingRange = ratingRange;
      $scope.ageRange = ageRange;
      $scope.filters = {
        gender: {
          male: true,
          female: true
        },
        rating: {
          min: ratingRange.min,
          max: ratingRange.max
        },
        age: {
          min: ageRange.min,
          max: ageRange.max
        }
      }

      $scope.applyFilters = applyFilters;
    }

    function init() {
      artistsSvc.getAll().then(function(response) {
        $scope.artists = response;
      });

      $ionicModal.fromTemplateUrl('templates/components/results/filter.html', {
        scope: $scope,
        animation: 'slide-in-up',
        controller: 'FilterCtrl'
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

    function applyFilters() {
      $scope.filterModal.hide();
      artistsSvc.getAll().then(function(artists) {
        var response = _.filter(artists, function(artist) {
          var success = true;
          success = success && artist.isGenderInRange($scope.filters.gender);
          success = success && artist.isAgeInRange($scope.filters.age);
          success = success && artist.isRateInRange($scope.filters.rating);
          // console.log(success);
          return success;
        });

        // console.log(response);
        $scope.artists = response;
      });

    }


  });
