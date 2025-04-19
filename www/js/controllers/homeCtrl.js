var STATE_LOGOUT = 'app.logout';
var STATE_SETTINGS = 'app.settings';
var STATE_SEARCH = 'app.search';


angular.module('amazona.controllers')
.controller('HomeCtrl', function($rootScope, $scope, $state, $ionicHistory, $ionicPopup, MyLoginService, MySyncService) {
    $scope.isUpdateAvailable = false;
    function getLocalVersion(callback) {
        console.log("start of getLocalVersion");
        db.transaction(function(tx) {
          tx.executeSql("SELECT theVersion FROM appSync LIMIT 1", [], function(tx, res) {
            console.log("start of getLocalVersion,", res);
            if (res.rows.length > 0) {
              callback(res.rows.item(0).theVersion);
            } else {
              callback(null);
            }
          }, function(error) {
            console.error("Error reading local version:", error);
            callback(null);
          });
        });
    }
      
    function checkForNewVersion() {
        console.log("start of version check");
        MySyncService.getTables().then(function(result) {
            var remoteVersion = parseFloat(result.version);
        
            console.log("remoteVersion", remoteVersion);

            getLocalVersion(function(localVersion) {
            localVersion = parseFloat(localVersion || 0);
            
            console.log("localVersion", localVersion);
            if (remoteVersion > localVersion) {

                console.log("trigger")
                $ionicPopup.alert({
                    title: 'New Data Available',
                    template: 'A new version of your app data is available. Please logout then go to "Sync app" to update.'
                });
                // Optional: you can set a flag here
                $scope.isUpdateAvailable = true;
            }
            });
        }).catch(function(err) {
            console.warn("Version check failed:", err);
        });
    }
    // Auto-run on controller load
    console.log("start of version check");
    checkForNewVersion();
    $scope.doLogout = function(){
        MyLoginService.cancelChosenGarage().then(
            function(val){
                //alert("cancelChosenGarage done");
            }, //resolve
            function(err){
                console.log("logout: error done:" + err.message);
            }
        ); //error
    
    
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        var forceSync=$rootScope.forceSync;
        $rootScope.$resetRootScope();
        $rootScope.forceSync=forceSync;
        $state.go(STATE_LOGOUT);
    }
    
    $scope.goToSettings=function(){
        $state.go(STATE_SETTINGS);
    }
    $scope.goToSearch=function(){
        $state.go(STATE_SEARCH);
    }
    
    $scope.logoImg=$rootScope.chosenGarage.logo;
})