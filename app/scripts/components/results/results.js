'use strict';

/**
 * @ngdoc function
 * @name lubertapp.components.results
 * @description
 * # Main Controller
 */
angular.module('lubertapp')
  .controller('ResultsCtrl', function($scope, $timeout, $ionicModal, $ionicScrollDelegate, events, artistsSvc) {
    // console.log(artistsSvc.getAll());
    var artistsListLimit = 20;
    var ratingRange = {
      min: 0,
      max: 100
    };

    var ageRange = {
      min: 16,
      max: 74
    };

    $scope.ratingRange = ratingRange;
    $scope.ageRange = ageRange;
    resetFilters();

    $scope.state = 'map';
    $scope.artists = [];

    $scope.artistsList = [];
    $scope.noMoreItemsAvailable = false;

    $scope.loadMore = loadMoreItems;
    $scope.setState = setState;
    $scope.showFilter = showFilter;
    $scope.applyFilters = applyFilters;
    $scope.resetFilters = resetFilters;


    artistsSvc.getAll().then(function(response) {
      $scope.artists = response;
      resetArtistsList();
      $timeout(function() {
        updateMapMarkers();
      });
      // console.log($scope.artistsList);
    });

    $ionicModal.fromTemplateUrl('templates/components/results/filter.html', {
      scope: $scope,
      animation: 'slide-in-up',
      controller: 'FilterCtrl'
    }).then(function(modal) {
      $scope.filterModal = modal;
    });









    function setState(state) {
      $scope.state = state;
     };

    function showFilter() {
      $scope.filterModal.show();
    }


    function resetFilters() {
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
    }

    function updateMapMarkers() {
      // console.log('update map markers');
      events.$emit(events.map.REMOVE_ALL_MARKERS);
      _.each($scope.artists, function(artist) {
        // console.log(artist);
        events.$emit(events.map.ADD_MARKER, artist);
      });

      $timeout(function() {
        events.$emit(events.map.FIT_BOUNDS);
      }, 300);
    }

    function resetArtistsList() {
      $scope.noMoreItemsAvailable = false;
      artistsListLimit = 10;
      $scope.artistsList = _.slice($scope.artists, 0, artistsListLimit);
      console.log($scope.artists.length, $scope.artistsList.length)
      $ionicScrollDelegate.scrollTop();
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
        resetArtistsList();
        updateMapMarkers();
      });
    }

    function loadMoreItems() {
      artistsListLimit += 10;
      $scope.artistsList = _.slice($scope.artists, 0, artistsListLimit);
      // console.log('loading more', $scope.artistsList.length);

      if ( $scope.artistsList.length === $scope.artists.length ) {
        $scope.noMoreItemsAvailable = true;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
  });
