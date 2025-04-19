angular.module('amazona.controllers')
.controller('SettingsCtrl', function($rootScope, $scope, $ionicHistory,MySettingsService) {
    //Validation
    //-----------
    
    $scope.formData = {};
    $scope.formData.unit = $rootScope.unit;
    
    $scope.formData.currency = "USD";
    $scope.formData.showAllHues = $rootScope.showAllHues;
    
    $scope.saveSettings = function() {
        console.log('Doing save settings:');
        $rootScope.unit=$scope.formData.unit;
        $rootScope.currency=$scope.formData.currency;
        $rootScope.showAllHues=$scope.formData.showAllHues;
        MySettingsService.saveShowAllHues($rootScope.showAllHues).then(
            function(){
                $ionicHistory.goBack();
            }
        )
    };
})