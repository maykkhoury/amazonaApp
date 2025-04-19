angular.module('amazona.controllers')
.controller('SynchappCtrl', function($ionicPopup, $ionicLoading, $rootScope, $scope, $timeout, $state, MySyncService) {
  
    function getLocalVersion(callback) {
        db.transaction(function(tx) {
            tx.executeSql("SELECT theVersion FROM appSync LIMIT 1", [], function(tx, res) {
                if (res.rows.length > 0) {
                callback(res.rows.item(0).theVersion);
                } else {
                callback(null); // No version stored yet
                }
            }, function(error) {
                console.error("Failed to get local version:", error);
                callback(null);
            });
        });
    }

    $scope.progressMessage = '';

    $scope.doSynch = function() {
        MySyncService.getTables().then(function(result) {
          var remoteVersion = result.version;
          var tables = result.tables;
      
          getLocalVersion(function(localVersion) {
            var shouldSync = function() {
              $ionicPopup.confirm({
                title: 'Confirm Sync',
                template: 'This will overwrite your local data. Do you want to continue?'
              }).then(function(res) {
                if (!res) return;
      
                $ionicLoading.show({
                  template: '<div>Synchronizing data...</div><div style="margin-top:10px;">{{progressMessage}}</div>',
                  scope: $scope
                });
      
                MySyncService.syncAllTables(tables, function(message) {
                  $timeout(function() {
                    $scope.progressMessage = message;
                  });
                }, remoteVersion).then(function(msg) {
                  $ionicLoading.hide();
                  $ionicPopup.alert({
                    title: 'Success',
                    template: msg
                  });
                }).catch(function(err) {
                  $ionicLoading.hide();
                  $ionicPopup.alert({
                    title: 'Error',
                    template: err
                  });
                });
              });
            };
      
            if (localVersion !== null && parseFloat(localVersion) >= parseFloat(remoteVersion)) {
              $ionicPopup.confirm({
                title: 'Already Up-to-Date',
                template: 'You already have the latest version. Do you still want to sync?'
              }).then(function(res) {
                if (res) shouldSync();
              });
            } else {
              shouldSync();
            }
          });
        });
      };
      
});
