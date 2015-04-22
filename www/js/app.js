// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('main', ['ionic', 'flickr', 'jp-infinite-scroll'])

.run(function($ionicPlatform, AppState) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

  });
})

.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', 
  function($locationProvider, $stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  var defaultState = {
    name: 'default', 
    url: '/',
    templateUrl: 'templates/default.html',
    controller: 'DefaultController as default'
  }

  var mainState = {
    name: 'main',
    url: '/:username', // this is either a username or a urlname of the user's flickr account
    templateUrl: 'templates/main.html',
    controller: 'MainController as main',
  }

//  $locationProvider
//    .html5Mode({enabled: true});

  $stateProvider.state(defaultState);
  $stateProvider.state(mainState);
}]);
