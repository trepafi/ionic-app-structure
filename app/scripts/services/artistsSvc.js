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


function Artist(data) {
  this._construct(data);
}

Artist.prototype._construct = function(data) {
  var self = this;
  _.each(data, function(item, key) {
    self[key] = item;
  });
};
