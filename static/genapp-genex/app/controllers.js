'use strict';


angular.module('genex.controllers', [])
    .controller('GenExCtrl', ['$scope', '$route', 'notify', 'Project',
        function ($scope, $route, notify, Project) {

        var projectId = $route.current.params.projectId;

        $scope.selection = [];

        if (!projectId) {
            notify({ type: 'error', message: 'No project ID found in the url address' });

        } else {

            Project.get({ id: $route.current.params.projectId }, function (proj) {
                $scope.tableOptions.project = proj;
            });
        }

        $scope.tableOptions = {
            itemsByPage: 15,
            project: null,
            genId: 'txttable',
            filter: function(obj) { return obj.type === 'data:genex:text:' },
            multiSelect: false,
            selectedItems: $scope.selection,
            showImport: false,
            showExport: false,
            showDelete: false,
            showShare: false
        };

        $scope.uploadOptions = {
            url: '/upload/',
            sequentialUploads: true,
            autoUpload: true,
            singleClickAccept: true
        };

        $element.find('#fileupload').on('fileuploaddone', function (e, data) {
            angular.forEach(data.result.files, function (file) {
                console.log(file);
                //runProcessor(file, $scope.options.processorName);
            });
        });
    }])
;
