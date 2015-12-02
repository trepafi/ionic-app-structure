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

  function mapCtrl($scope, $timeout, $q, leafletData) {
    $scope.defaults = {
      center: {
        lat: 51.5126064,
        lng: -0.1802461,
        zoom: 9
      }
    };

    // $scope.tiles = {
    //   default: {
    //     url: "http://a.tile.osm.org/{z}/{x}/{y}.png"
    //   }
    // }
  }
}
