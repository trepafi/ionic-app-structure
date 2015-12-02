'use strict';

angular.module('lubertapp')
  .directive('ltMap', ltMapDirective);


function ltMapDirective(){
  return {
    restrict: 'E',
    controller: mapCtrl,
    scope: {
      cssClass: "@"
    },
    templateUrl: "templates/directives/map/map.html"
  };

  function mapCtrl($scope, $timeout, $q, events, leafletData) {
    $scope.map;
    $scope.markers = [];
    $scope.defaults = {
      center: {
        lat: 51.5126064,
        lng: -0.1802461,
        zoom: 9
      }
    };

    isMapReady().then(function(map) {
      events.$on(events.map.REMOVE_ALL_MARKERS, function(ev) {
        console.log('removing all markers');
        if($scope.markers.length > 0) {
          _.each($scope.markers, function(marker) {
            // console.log(marker);
            $scope.map.removeLayer(marker);
          });
          $scope.markers = [];
        }
      });

      events.$on(events.map.ADD_MARKER, function(ev, markerData) {
        var location = {
          lat: markerData.latitude,
          lng: markerData.longitude
        }
        var marker = L.marker(location);
        marker.addTo($scope.map);
        $scope.markers.push(marker);
      });

      events.$on(events.map.FIT_BOUNDS, function(ev) {
        if($scope.markers.length > 0) {
          var group = new L.featureGroup($scope.markers);
          $scope.map.fitBounds(group.getBounds());
        }
      });
    });



    function isMapReady() {
      var deferred = $q.defer();
      if(!$scope.map) {
        leafletData.getMap().then(function(map) {
          $scope.map = map;
          deferred.resolve(map);
        });
      }
      else {
        deferred.resolve($scope.map);
      }
      return deferred.promise;
    }

  }
}
