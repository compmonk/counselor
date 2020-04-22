(function () {
    'use strict';
    const counselor = angular.module('counselor');

    counselor.controller('walletController', ['$scope', '$http', '$cookies', '$location', walletController]);

    function walletController($scope, $http, $cookies, $location) {
        $scope.getBalance = function () {
            $http.get("/api/user/balance")
                .then((response) => {
                    $scope.balances = response.data;
                })
        }();
    }
}());
