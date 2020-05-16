(function () {
    'use strict';
    const counselor = angular.module('counselor', ['ngRoute', 'ngCookies']);

    counselor.controller('counselorController', ['$scope', '$http', counselorController]);

    function counselorController($scope, $http) {
    }

    counselor.config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/signin', {
                templateUrl: '/public/html/signin.html',
                controller: 'userController'
            })
            .when('/signup', {
                templateUrl: '/public/html/signup.html',
                controller: 'userController'
            })
            .when('/home', {
                templateUrl: '/public/html/home.html'
            })
            .when('/article', {
                templateUrl: '/public/html/article.html',
                controller: 'articleController'
            })
            .when('/wallet', {
                templateUrl: '/public/html/wallet.html',
                controller: 'walletController'
            })
            .when('/courses', {
                templateUrl: '/public/html/course.html',
                // controller: 'courseController'
            })
            .when('/profile', {
                templateUrl: '/public/html/profile.html',
                controller: 'profileController'
            })
            .when('/sessions', {
                templateUrl: '/public/html/sessions.html',
                controller: 'sessionController'
            })
            .when('/recommendation', {
                templateUrl: '/public/html/recommendation.html',
                controller: 'recommendationController'
            })
            .otherwise({
                redirectTo: '/signin'
            });

        $locationProvider.hashPrefix('');
    });
}());