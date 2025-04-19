var STATE_AFTER_LOGIN = 'app.home';

angular.module('amazona.controllers')
.controller('LoginCtrl', function($q,$rootScope, $scope, $timeout, $interval, $state, $ionicPopup, $ionicHistory,$ionicPlatform, MyLoginService,MySyncService) {

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
                    template: 'A new version of your app data is available. Go to "Sync app" to update.'
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
    
    var intervalId;

        //$ionicPlatform.ready(function () {

    $timeout(function() {

        console.log("ready of loginCtr");

        var chosenDone=$rootScope.garageChosenDone;

        //USE THIS RETURN WHEN IN IONIC SERVE

        //return;

        intervalId=setInterval(function() {

            console.log("getChosenGarage in interval");

            if(chosenDone){

                console.log("getChosenGarage in interval chosen done, clear the interval");

                clearInterval(intervalId);

                return;

            }

            if(db==null){

                console.log("getChosenGarage in interval db not ready");

                return;

            }

            MyLoginService.getChosenGarage().then(

                function(val){

                    chosenDone=true;

                    console.log("chosen garage of loginCtr");

                    if(val !== null){

                        $scope.afterLogin(val);

                    }

                }

            );

        }, 100);

    },1000);
    
    //Validation
    $scope.myErrorLabelClass = "hideLabel";
    $scope.formData = {};
    $scope.afterLogin = function(val) {
        console.log("afterLogin of loginCtr");
        //alert("afterlogin" + val);
        $rootScope.chosenGarage = val;
        $rootScope.showAllHues=$rootScope.chosenGarage.showAll ==="1";
        
        console.log("SELECTED -> " + val.id_garage+ " " + val.key);
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $scope.formData = {};
        $rootScope.connected= "1";
        $scope.myErrorLabelClass = "hideLabel";
        //alert("afterlogin - STATE_AFTER_LOGIN:" + STATE_AFTER_LOGIN);
        $state.go(STATE_AFTER_LOGIN);
    }
     // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        //alert("logging in")
            console.log('Doing login:' + $scope.formData.garageKey);
            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            var enteredKey = $scope.formData.garageKey;
            var enteredName = $scope.formData.garageName;
            //alert("doLogin CTRL:" + enteredKey);
            
            MyLoginService.doLogin(enteredKey,enteredName).then(
                function(val){
                    //alert("logged in with val"+val);
                    //alert("doLogin CTRL: resolve done");
                    console.log("resolve done:" + val);
                    if(val !=null){
                        MyLoginService.setChosenGarage(enteredKey).then(
                            function(){
                                //alert("then of setchosen:" + val);
                                $scope.afterLogin(val);
                            }
                        );
                        
                    }else{
                        console.log("wrong key");
                        $scope.myErrorLabelClass = "";
                    }
                }, //resolve
                function(err){
                    console.log("doLogin CTRL: error done");
                    console.log("doLogin CTRL: error done:" + err.message);
                    console.log("error!" + err.message);
                }
            ); //error
                                                
    };
    
})