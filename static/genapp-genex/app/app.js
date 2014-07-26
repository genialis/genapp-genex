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

    .config(['$httpProvider', function ($httpProvider) {
        // Adds a csrftoken to all http requests.
        $httpProvider.defaults.headers.common['X-CSRFToken'] = $.cookie('csrftoken');
    }])

    .run(['forceTitle', function (forceTitle) {
        forceTitle('GenEx');
    }])
;
