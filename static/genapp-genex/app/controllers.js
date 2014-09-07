'use strict';


angular.module('genex.controllers', [])
    .controller('GenExCtrl', ['$scope', '$route', 'notify', 'Project', 'Data', 'DataCache', 'fileUpload', 'createAndWaitProcessor',
        function ($scope, $route, notify, Project, Data, DataCache, fileUpload, createAndWaitProcessor) {

        var uploadProcName = 'import:upload:textfile';
        var uploadProcType = 'data:genex:text:';

        var processProcName = 'genex:wordfreq';

        var projectId = $route.current.params.projectId;
        if (!projectId) {
            notify({ type: 'error', message: 'No project ID found in the url address' });
        } else {
            Project.get({ id: projectId }, function (proj) {
                $scope.tableOptions.project = proj;
            });
        }

        $scope.tableOptions = {
            itemsByPage: 15,
            project: null,
            genId: 'txttable',
            filter: function (obj) { return obj.type === uploadProcType; },
            multiSelect: false,
            selectedItems: [],
            showImport: false,
            showExport: false,
            showDelete: false,
            showShare: false
        };

        $scope.uploadOptions = fileUpload.chunkRetrying({
            finalDone: function (serverFile, clientFile) {
                var process = new Data({
                    case_id: projectId,
                    processor_name: uploadProcName,
                    input: {
                        txtin: {
                            file: serverFile.name,
                            file_temp: serverFile.temp
                        }
                    }
                });
                DataCache.save(process);
            }
        });

        $scope.$watchCollection('tableOptions.selectedItems', function (items) {
            if (_.isEmpty(items)) return;
            $scope.item = items[0];

            createAndWaitProcessor(projectId, processProcName, { txtin: $scope.item.id }, 1000, function (d) {
                return d.output.freq; // TODO: where is storage ID saved
            }).promise.then(function (data) {
                $scope.results = data;
            }, function (reason) {
                console.log('error', reason);
            }, function (data){
                $scope.processingItem = data;
            });
        });

        $scope.withoutSchemas = function (obj) {
            return _.omit(obj, function (value, key) {
                return _.contains(key, 'schema');
            });
        };
    }])
;
