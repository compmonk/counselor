(function () {
    'use strict';
    const counselor = angular.module('counselor');

    counselor.controller('profileController', ['$scope', '$http', '$cookies', '$location', profileController]);

    function profileController($scope, $http, $cookies, $location) {
        $scope.getUser = function () {
            $http.get("/api/user/get/", $scope.user)
                .then((response) => {
                    $scope.user = response.data;
                    console.log($scope.user);
                })
        }();

        $scope.updateUser = function () {
            $http.put("/api/user/update/", $scope.user)
                .then((response) => {
                    $scope.user = response.data;
                    console.log($scope.user);
                })
        };
    }
}());
