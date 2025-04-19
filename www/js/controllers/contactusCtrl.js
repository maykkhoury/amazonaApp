var STATE_AFTER_LOGIN = 'app.home';
var STATE_LOGOUT = 'app.logout';

angular.module('amazona.controllers')
.controller('ContactusCtrl', function($rootScope, $scope, $state, $ionicHistory, MyLoginService) {
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
  
  
  //Email managing: plugin not used, using href="mailto:...." instead
  
  /*$scope.sendEmail = function (email) {
    if (window.plugins && window.plugins.emailComposer) { //check if plugin exists

      window.plugins.emailComposer.showEmailComposerWithCallback(function (result) {
          //console.log("Email sent successfully");
        },

        null,        // Subject
        null,        // Body
        [email],     // To (Email to send)
        null,        // CC
        null,        // BCC
        false,       // isHTML
        null,        // Attachments
        null);       // Attachment Data
    }

  };*/

})