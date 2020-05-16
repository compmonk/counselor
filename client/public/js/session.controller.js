(function () {
    'use strict';
    const counselor = angular.module('counselor');

    counselor.controller('sessionController', ['$scope', '$http', '$cookies', '$location', sessionController]);

    function sessionController($scope, $http, $cookies, $location) {
        $scope.getSessions = function () {
            $http.get("/api/user/sessions")
                .then((response) => {
                    $scope.sessions = response.data;
                })
        }();
    }
}());
