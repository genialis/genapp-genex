'use strict';


angular.module('genex.controllers', [])
    .controller('GenExCtrl', ['_project', '$scope', 'notify', 'Data', 'DataCache', 'fileUpload', 'createAndWaitProcessor',
        function (_project, $scope, notify, Data, DataCache, fileUpload, createAndWaitProcessor) {

        var importProcName = 'import:upload:textfile';
        var importProcType = 'data:genex:text:';

        var wordsProcName = 'genex:wordfreq';

        // Set gentable options
        $scope.tableOptions = {
            itemsByPage: 15,
            project: _project,
            genId: 'txttable',
            genPackage: 'genex',
            filter: function (obj) { return obj.type === importProcType; }, // Only show text objects
            multiSelect: false,
            selectedItems: [],
            showImport: false,
            showExport: false,
            showDelete: false,
            showShare: false
        };

        // Setup file uploading options
        // chunkRetrying adds auto-retrying after errors (wifi change, server down, computer standby)
        $scope.uploadOptions = fileUpload.chunkRetrying({
            // When the file is uploaded
            finalDone: function (serverFile, clientFile) {
                // Set import processor parameters
                var process = new Data({
                    case_ids: [_project.id],
                    processor_name: importProcName,
                    input: {
                        txtin: {
                            file: serverFile.name,
                            file_temp: serverFile.temp
                        }
                    }
                });

                // Run import processor
                var updateGentableAutomatically = true;
                if (updateGentableAutomatically) {
                    DataCache.save(process); // Runs processor and updates gentable automatically (GenTable uses cache and DataCache updates it)
                } else {
                    process.$save(); // This also runs the processor, but gentable is not updated
                    $route.reload();
                }
            }
        });

        $scope.$watchCollection('tableOptions.selectedItems', function (items) {
            // If anything is selected in gentable, seve it to item
            // SelectedItems will contain as most 1 item, because tableOptions.multiSelect is off
            if (_.isEmpty(items)) return;
            $scope.item = items[0];

            // Run words processor and wait for it to finish, then get the data (output.freq) from storage
            runWordsProcessor($scope.item);
            // runWordsProcessorShortVersion($scope.item);
        });

        function runWordsProcessor(item) {
            // Processor inputs
            var inputs = { txtin: item.id };

            // When it finally finishes, find it's storage ID, where the results are saved
            function getStorageId(processedData) {
                return processedData.output.freq; // TODO: where is storage ID saved
            }

            // When results are obtained from storage, save them into results variable
            function onStorageDataRecieved(storageData) {
                $scope.results = storageData;
            }

            // Before processor has finished:
            //   after every change, update processor's state in processingItem variable
            function onChange(processingData) {
                $scope.processingItem = processingData;
            }

            // If an error occurs, log it into console.
            // Some errors are already handled within createAndWaitProcessor and show a notification
            function onErrorOccured(errorReason) {
                console.log('error', errorReason);
            }

            createAndWaitProcessor(_project.id, wordsProcName, inputs, getStorageId)
                .promise.then(onStorageDataRecieved, onErrorOccured, onChange);
        }

        // A shorter version of runWordsProcessor
        function runWordsProcessorShortVersion(item) {
            createAndWaitProcessor(_project.id, wordsProcName, { txtin: item.id }, function (processedData) {
                return processedData.output.freq; // TODO: where is storage ID saved
            }).promise.then(function (storageData) {
                $scope.results = storageData;
            }, function (errorReason) {
                console.log('error', errorReason);
            }, function (processingData) {
                $scope.processingItem = processingData;
            });
        }

        // Remove schemas from json output
        $scope.withoutSchemas = function (obj) {
            return _.omit(obj, function (value, key) {
                return _.contains(key, 'schema');
            });
        };
    }])
;
