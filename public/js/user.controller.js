(function () {
    'use strict';
    const counselor = angular.module('counselor');

    counselor.controller('userController', ['$scope', '$http', '$cookies', '$location', userController]);

    function userController($scope, $http, $cookies, $location) {

        $scope.signin = function () {
            $http.post("/api/root/login", $scope.user)
                .then((response) => {
                    $scope.user = response.data;
                    console.log($scope.user);
                    console.log($cookies.getAll());
                    $location.path("/home")
                })
        };

        $scope.signup = function () {
            $http.post("/api/root/signup/", $scope.user)
                .then((response) => {
                    $scope.user = response.data;
                    console.log($cookies.getAll());
                    $location.path("/home")
                })
        };

        $scope.logout = function () {
            $http.get("/api/root/logout/")
                .then((response) => {
                })
        };

    }
}());
