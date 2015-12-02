'use strict';
angular.module('lubertapp')
  .factory('events', eventsFactory)
  .value('eventsList', getEvents());

function eventsFactory($rootScope, eventsList) {
    var events = angular.copy(eventsList);
    events.$emit = function () {
        $rootScope.$emit.apply($rootScope, arguments);
    };

    events.$broadcast = function () {
        $rootScope.$broadcast.apply($rootScope, arguments);
    };

    events.$on = function () {
        return $rootScope.$on.apply($rootScope, arguments);
    };

    events.$clear = function (name) {
        $rootScope.$$listeners[name].length = 0;
    };

    return events;
}

function getEvents() {
  return {
    "map": {
      "ADD_MARKER": "ADD_MARKER",
      "REMOVE_ALL_MARKERS": "REMOVE_ALL_MARKERS",
      "FIT_BOUNDS": "FIT_BOUNDS"
    }
  };
}
