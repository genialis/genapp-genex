'use strict';


angular.module('genex', ['ngRoute', 'genjs.services', 'genex.controllers'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/static/genapp-genex/partials/genex.html',
            controller: 'GenExCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
    }])
    .constant('title', 'GenEx')
;
