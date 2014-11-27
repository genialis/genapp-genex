'use strict';


angular.module('genex', ['ngRoute', 'ngGrid', 'genjs.services', 'genjs.table',
    'genex.controllers', 'blueimp.fileupload'])

    .config(['$routeProvider', 'appProjectsProvider', 'resolveByRouteField', function ($routeProvider, appProjectsProvider, resolveByRouteField) {

        appProjectsProvider.$routeProvider()
        .when('/:projectSlug/', {
            templateUrl: '/static/genpackage-genex/partials/genex.html',
            controller: 'GenExCtrl',
            resolve: { _project: resolveByRouteField('Project', 'url_slug', 'projectSlug', true) }
        })
        .otherwise({
            redirectTo: '/'
        });
    }])
    .constant('title', 'GenEx')
;
