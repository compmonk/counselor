(function () {
    'use strict';
    const counselor = angular.module('counselor');

    counselor.controller('articleController', ['$scope', '$http', '$cookies', '$location', articleController]);

    function articleController($scope, $http, $cookies, $location) {
        $scope.getPurchasedArticles = function () {
            $http.get("/api/user/articles")
                .then((response) => {
                    $scope.articles = response.data;
                    // $location.path("/article")
                })
        }();

        $scope.addArticle = function () {
            console.log($scope.article);
            $http.post("/api/articles/", $scope.article)
                .then((response) => {
                    console.log(response.data);
                    $scope.getPurchasedArticles();
                    $location.path("/wallet")
                })
        }
    }
}());
