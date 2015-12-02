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
    console.log($scope);
  }
}
