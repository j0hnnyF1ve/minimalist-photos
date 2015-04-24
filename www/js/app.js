// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('main', ['ionic', 'flickr', 'jp-infinite-scroll'])

.run(function($ionicPlatform, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    $state.go('main', { username: 'john_pangilinan'} );

  });
})

.config(['$ionicConfigProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 
  function($ionicConfigProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
    $ionicConfigProvider.views.maxCache(1);

  $urlRouterProvider.otherwise('/');

  var defaultState = {
    url: '/',
    views: { 
      'content' : {
        templateUrl: 'default',
        controller: 'DefaultController as default'
      }
    }
  }

  var mainState = {
    url: '/:username', // this is either a username or a urlname of the user's flickr account
    views : {
      'content' : {
        templateUrl: 'main',
        controller: 'MainController as main',
      }      
    }
  }

//  $locationProvider
//    .html5Mode({enabled: true});

  $stateProvider.state('default', defaultState);
  $stateProvider.state('main', mainState);
}]);
