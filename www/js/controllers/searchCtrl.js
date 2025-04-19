var STATE_COLORLIST = 'app.colorlist';

angular.module('amazona.controllers')
.controller('SearchCtrl', function($stateParams, $rootScope, $scope, $timeout, $state, $ionicHistory,MySettingsService) {
    $scope.cars = $rootScope.cars;
    $scope.formData = {};
    $scope.formData.unit='';
    if($rootScope.unit !==undefined){
        $scope.formData.unit=$rootScope.unit;
    }else{
        $scope.formData.unit='L';
    }
    $scope.formData.currency='';
    if($rootScope.currency !==undefined){
        $scope.formData.currency=$rootScope.currency;
    }else{
        $scope.formData.currency='USD';
    }
    
    // Perform the search action when the user submits the form
    $scope.formData.selectedCarRequiredError=false;
    $scope.formData.yearNumericError=false;
    $scope.doSearch = function() {
        console.log('Doing search');
        var fail=false;
        //SearchCtrlValidation
        //required: car
        //numeric: year
        //-----------
        if($scope.formData.selectedCar === undefined){
            $scope.formData.selectedCarRequiredError=true;
            fail=true;
        }
        if($scope.formData.year !== undefined && isNaN($scope.formData.year)){
            $scope.formData.yearNumericError=true;
            fail=true;
        }
        if(fail === false){
            $scope.clearValidation();
            $scope.formData.selectedCar;
            var colorCodeSearchObj = $scope.formData.colorCode;
            if (colorCodeSearchObj === undefined){
                colorCodeSearchObj="";
            }else{
                colorCodeSearchObj = colorCodeSearchObj + "%";
            }
            var searchObjectAngular={
                id_car: $scope.formData.selectedCar.id_car,
                carName: $scope.formData.selectedCar.carName,
                carImgPath: $scope.formData.selectedCar.carImgPath,
                tableName: $scope.formData.selectedCar.tableName,
                name_formula: $scope.formData.formulaName,
                c_year: $scope.formData.year,
                colorCode: colorCodeSearchObj,
                cardNumber: $scope.formData.cardNumber,
                id_formula: "-1"
            };
            
            var searchObjectJason = angular.toJson(searchObjectAngular);
            //debugger;
            $state.go(STATE_COLORLIST, { searchObject: searchObjectJason});
        
        
            //$state.go(STATE_COLORLIST, { carName: $scope.formData.selectedCar.carName});
        }
        
    };
    $scope.clearInput = function() {
        console.log('Doing clear');
        $scope.formData.car="";
        $scope.formData.colorCode="";
        $scope.formData.formulaName="";
        $scope.formData.cardNumber="";
        $scope.formData.year="";
        
        //validation
        $scope.clearValidation();
        //------------
    };
    $scope.clearValidation = function() {
        $scope.formData.selectedCarRequiredError=false;
        $scope.formData.yearNumericError=false;
    };
    $scope.goHome = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go(STATE_AFTER_LOGIN);
        
    };
})