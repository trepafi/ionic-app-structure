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

    $scope.state = 'graphs';
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
      prepareDataForTabs();
      // console.log($scope.artistsList);
    });

    $ionicModal.fromTemplateUrl('templates/components/results/filter.html', {
      scope: $scope,
      animation: 'slide-in-up',
      controller: 'FilterCtrl'
    }).then(function(modal) {
      $scope.filterModal = modal;
    });

    // Graphs options
    $scope.graphs = {
      data: [],
      options: {
        chart: {
          type: 'pieChart',
          height: 500,
          x: function(d){return d.age;},
          y: function(d){return d.qty;},
          showLabels: true,
          duration: 500,
          labelThreshold: 0.01,
          labelSunbeamLayout: true,
          legend: {
            margin: {
              top: 5,
              right: 35,
              bottom: 5,
              left: 0
            }
          }
        }
      }
    };



    function prepareDataForTabs() {
      switch ($scope.state) {
        case 'list':
          resetArtistsList();
          break;
        case 'map':
          $timeout(function() {
            updateMapMarkers();
          });
          break;
        case 'graphs':
          getGraphData();
          break;
      }
    }



    function setState(state) {
      $scope.state = state;

      if(state === 'graphs') {
        getGraphData();
      }
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

    function loadMoreItems() {
      artistsListLimit += 10;
      $scope.artistsList = _.slice($scope.artists, 0, artistsListLimit);
      // console.log('loading more', $scope.artistsList.length);

      if ( $scope.artistsList.length === $scope.artists.length ) {
        $scope.noMoreItemsAvailable = true;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
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
        prepareDataForTabs();
      });
    }

    function resetArtistsList() {
      $scope.noMoreItemsAvailable = false;
      artistsListLimit = 10;
      $scope.artistsList = _.slice($scope.artists, 0, artistsListLimit);
      // console.log($scope.artists.length, $scope.artistsList.length)
      $ionicScrollDelegate.scrollTop();
    }

    function updateMapMarkers() {
      events.$emit(events.map.REMOVE_ALL_MARKERS);
      _.each($scope.artists, function(artist) {
        events.$emit(events.map.ADD_MARKER, artist);
      });

      $timeout(function() {
        events.$emit(events.map.FIT_BOUNDS);
      }, 300);
    }

    function getGraphData() {
      var i = 1;
      var result = _.chain($scope.artists)
          .groupBy("age")
          .pairs()
          .map(function(item) {
            return _.object(_.zip(["age", "qty"], [ item[0], item[1].length ]));
          })
          // .value()
          .groupBy(function(item) {
            return item.age, Math.floor(parseInt(item.age) / 10);
          })
          .map(function(item) {
            // console.log(item);
            var t = 0;
            _.each(item, function(it) {
              t += it.qty;
            });
            return {
              age: i + '0 - ' + (i++) + '9 years: ' + t,
              qty: t
            };
          })
          .value();

      // console.log(result);

      $scope.graphs.data = result;


    }
  });
