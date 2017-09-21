(function () {
  'use strict';
  angular.module('QuantoxRoutesApp', ['ngRoute', 'ngAnimate'])
    .config([
      '$locationProvider',
      '$routeProvider',
      function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('');
        // routes
        $routeProvider
          .when("/", {
            templateUrl: "./partials/routes.html",
            controller: "RoutesController"
          })
          .when("/details", {
            templateUrl: "./partials/route-details.html",
            controller: "RouteDetailsController"
          })
          .otherwise({
            redirectTo: '/'
          });
      }
    ]);

  angular.module('QuantoxRoutesApp')
    .run(['$rootScope', '$location', function ($rootScope, $location) {
      var path = function () { return $location.path(); };
      $rootScope.$watch(path, function (newVal, oldVal) {
        $rootScope.activetab = newVal;
      });
    }]);

  angular.module('QuantoxRoutesApp')
    .controller('RoutesController', [
      '$scope', '$window', '$location',
      function ($scope, $window, $location) {
        var routes = JSON.parse(window.localStorage.getItem('routes'));
        if (routes) {
          $scope.routes = routes;
        }
        else {
          $scope.routes = [];
        }

        $scope.routeDetails = function () {
          if($scope.route.startPoint && $scope.route.endPoint) {
            var isForSave = true;

            for (var i= 0; i< $scope.routes.length ; i++) {
              if($scope.route.startPoint == $scope.routes[i].startPoint && $scope.route.endPoint ==  $scope.routes[i].endPoint) {
                isForSave = false;
                break;
              }
            }

            if(isForSave) {
              saveRoute();
            }

            var currentRoute = angular.copy($scope.route);
            window.localStorage.setItem('currentRoute', JSON.stringify(currentRoute));
  
            $location.path("/details");
          }
          
        };

        function saveRoute() {
          var route = angular.copy($scope.route);
          $scope.routes.push(route);
          setStorage();
        }

        $scope.removeRoute = function (index) {
          $scope.routes.splice(index, 1);
          setStorage();
        };

        $scope.getRoute = function (index) {
          $scope.route = angular.copy($scope.routes[index]);
          setStorage();
        };

        function setStorage() {
          var routes = angular.copy($scope.routes);
          window.localStorage.setItem('routes', JSON.stringify(routes));
        }

      }
    ]);

  angular.module('QuantoxRoutesApp')
    .controller('RouteDetailsController', [
      '$scope','$sce', '$window',
      function ($scope, $sce, $window) {

        var currentRoute = JSON.parse(window.localStorage.getItem('currentRoute'));
        if (currentRoute) {
          var origin = currentRoute.startPoint.replace(" ", "+");
          var destination = currentRoute.endPoint.replace(" ", "+");
          $scope.mapUrl = $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/directions?key=AIzaSyCadJlCUMATV_VmPqkzKm3h_PThPMEU6tg&origin=" + origin + "&destination=" + destination + "&mode=driving");
        }
      }
    ]);

}());