var STATE_AFTER_LOGIN = 'app.home';
var STATE_LOGOUT = 'app.logout';

angular.module('amazona.controllers')
.controller('AboutCtrl', function($rootScope, $scope, $state, $ionicHistory, MyLoginService) {
    var thisController = this;
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
    
    $scope.goHome = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        if($rootScope.connected=="1"){
            $state.go(STATE_AFTER_LOGIN);
        }else{
            $state.go(STATE_LOGOUT);
        }
    };
    
})