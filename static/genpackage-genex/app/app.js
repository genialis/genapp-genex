'use strict';


angular.module('genex', ['ngRoute', 'ngGrid', 'genjs.services', 'genjs.table',
    'genex.controllers', 'blueimp.fileupload'])

    .config(['$routeProvider', 'appProjectsProvider', function ($routeProvider, appProjectsProvider) {

        appProjectsProvider.$routeProvider()
        .when('/:projectId/', {
            templateUrl: '/static/genpackage-genex/partials/genex.html',
            controller: 'GenExCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
    }])
    .constant('title', 'GenEx')
;
