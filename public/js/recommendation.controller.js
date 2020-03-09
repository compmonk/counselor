(function () {
    'use strict';
    const counselor = angular.module('counselor');

    counselor.controller('recommendationController', ['$scope', '$http', '$cookies', '$location', recommendationController]);

    function recommendationController($scope, $http, $cookies, $location) {

        $scope.getRecommendation = function () {
            $http.get("/api/user/recommendation")
                .then((response) => {
                    $scope.recommendations = response.data;
                    // console.log($scope.user);
                    // console.log($cookies.getAll());
                    // $location.path("/home")
                })
        }();

        $scope.purchase = function (articleId) {
            $http.post(`/api/articles/${articleId}/purchase`, {})
                .then((response) => {
                    $scope.purchasedArticle = response.data;
                    console.log($cookies.getAll());
                    $location.path("/article")
                })
        };
    }
}());
