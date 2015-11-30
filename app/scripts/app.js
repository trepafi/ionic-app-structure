'use strict';

/**
 * @ngdoc overview
 * @name Lubertapp
 * @description
 * # Initializes main application and routing
 *
 * Main module of the application.
 */

angular.module('lubertapp', ['ionic', 'ngCordova', 'ngResource', 'ngMessages', 'ngAnimate'])
  .config(LubertAppConfig)
  .run(LubertAppRun);

function LubertAppConfig($httpProvider, $stateProvider, $urlRouterProvider) {
  // Application routing
  $stateProvider
    .state('app', {
      url: '',
      abstract: true,
      templateUrl: 'templates/components/main/main.html',
      controller: 'MainCtrl'
    })
    .state('app.results', {
      url: '/results',
      views: {
        'viewContent': {
          templateUrl: 'templates/components/results/results.html'
          // controller: 'ResultsCtrl'
        }
      }
    });

  // redirects to default route for undefined routes
  $urlRouterProvider.otherwise('/results');

}

function LubertAppRun($rootScope, $timeout, $state, $ionicPlatform, $ionicConfig, $cordovaSplashscreen, $cordovaNetwork, $cordovaToast) {
  // Ionic Stuff
  $rootScope.$on('$ionicView.loaded', function() {
    ionic.Platform.ready(function() {
      if(navigator && navigator.splashscreen) {
        navigator.splashscreen.hide();
      }
    });


  });

  $ionicPlatform.ready(function() {

  });

  // Validating authentication
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

  });
}
