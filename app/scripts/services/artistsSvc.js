'use strict';

angular.module('lubertapp')
  .factory('artistsSvc', artistsSvc);


function artistsSvc($q, artistsDS) {
  function getAll() {
    var deferred = $q.defer();
    deferred.resolve(artistsDS);
    return deferred.promise;
  }

  return {
    getAll: getAll
  }
}
