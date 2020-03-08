(function () {
    'use strict';
    const counselor = angular.module('counselor', ['ngRoute']);

    counselor.controller('counselorController', ['$scope', '$http', counselorController]);

    function counselorController($scope, $http) {
    }

    counselor.config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: '/public/html/home.html'
            })
            .when('/article', {
                templateUrl: '/public/html/article.html',
                // controller: 'articleController'
            })
            .when('/wallet', {
                templateUrl: '/public/html/wallet.html',
                // controller: 'walletController'
            })
            .when('/courses', {
                templateUrl: '/public/html/course.html',
                // controller: 'courseController'
            })
            .when('/profile', {
                templateUrl: '/public/html/profile.html',
                // controller: 'userController'
            })
            .when('/sessions', {
                templateUrl: '/public/html/sessions.html',
                // controller: 'sessionController'
            })
            .otherwise({
                redirectTo: '/home'
            });

        $locationProvider.hashPrefix('');
    });
}());