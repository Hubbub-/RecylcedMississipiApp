angular.module('app', ['ngResource', 'ngRoute', 'leaflet-directive', 'ngAnimate', 'ngTouch', 'ngFader']);



angular.module('app').config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.
        when('/', { templateUrl: '/partials/main/main', controller: 'rmMainCtrl', title: 'expedition'}).
        when('/ABOUT', {templateUrl: 'partials/main/ABOUT', title: 'about'}).
        when('/PRESS', {templateUrl: 'partials/main/PRESS', title: 'press'});

    
});

