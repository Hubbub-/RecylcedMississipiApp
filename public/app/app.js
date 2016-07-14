angular.module('app', ['ngResource', 'ngRoute', 'leaflet-directive']);

angular.module('app').config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.
        when('/', { templateUrl: '/partials/main/main', controller: 'rmMainCtrl'}).
        when('/ABOUT', {templateUrl: 'partials/main/ABOUT'}).
        when('/PRESS', {templateUrl: 'partials/main/PRESS'});

    
});

