var STATE_AFTER_LOGIN = 'app.home';
var STATE_LOGOUT = 'app.logout';
var STATE_LOCATOR_RESULT = 'app.colorlocatorresult';

angular.module('amazona.controllers')
.controller('ColorlocatorCtrl', function($window, $rootScope, $scope, $state, $stateParams, $ionicHistory, getAllCarsService,MyLoginService) {
    //main navigation
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
    //--------------------------------------
    
    $scope.formData={};
    $scope.formData.disableModel=true;
    $scope.formData.disableYear=true;
    $scope.formData.disableSearch=true;

    
    $scope.formData.carWithLocators=[];
    
    getAllCarsService.getCarNamesWithLocators().then(
            function(val){
                $scope.formData.carWithLocators = val;
            }
        );
                    
    $scope.formData.models=[];
    $scope.formData.years=[];
    
    $scope.updateModels = function(){
        if($scope.formData.selectedCar !== undefined){
            var carNameSelected = $scope.formData.selectedCar.carName;
            //fill the Model Combo
            if(carNameSelected !== undefined && carNameSelected !== ''){
                getAllCarsService.getCarModels(carNameSelected).then(
                    function(valM){
                        if(valM.length === 1 && valM[0].model.toLowerCase() === "all"){ //only all
                            $scope.formData.models = [{"model":"all"}];
                        }else{
                            $scope.formData.models=valM;
                        }
                        $scope.formData.selectedModel=$scope.formData.models[0];
                        $scope.formData.disableModel=false;
                        $scope.updateYears();
                    }
                );
            }
            //--------------------
        }
    };
    
    $scope.updateYears = function(){
        if(    $scope.formData.selectedCar !== undefined &&
            $scope.formData.selectedModel !== undefined){
                
            var carNameSelected = $scope.formData.selectedCar.carName;
            var modelSelected = $scope.formData.selectedModel.model;
            //fill the Model Combo
            if(    carNameSelected !== undefined && carNameSelected !== '' &&
                modelSelected !== undefined && modelSelected !== ''){
                getAllCarsService.getCarYears(carNameSelected, modelSelected).then(
                    function(val){
                        if(val===undefined || val===null || val.length===0){
                            $scope.formData.years = [];
                            $scope.formData.disableYear=true;
                        }else{
                            $scope.formData.years = val;
                            $scope.formData.selectedYear=$scope.formData.years[0];
                            $scope.formData.disableYear=false;
                            $scope.formData.disableSearch=false;
                        }
                    }
                );
            }
            //--------------------
        }
    }
    $scope.searchMarkers = function(){
        if(    $scope.formData.selectedCar !== undefined &&
            $scope.formData.selectedModel !== undefined &&
            $scope.formData.selectedYear !== undefined){
                
            var carNameSelected = $scope.formData.selectedCar.carName;
            var modelSelected = $scope.formData.selectedModel.model;
            var yearSelected = $scope.formData.selectedYear.year;
            
            getAllCarsService.getLocators(carNameSelected, modelSelected,yearSelected).then(
                function(val){
                    var searchObjectAngular={
                        markers: val
                    };
                    var searchObjectJason = angular.toJson(searchObjectAngular);
                    
                    $state.go(STATE_LOCATOR_RESULT, { searchObject: searchObjectJason});
                    //$scope.drawMarkers(val);
                }
            );
        }
    };
    
})