var STATE_AFTER_LOGIN = 'app.home';
var STATE_LOGOUT = 'app.logout';
var STATE_SETTINGS = 'app.settings';
var STATE_SEARCH = 'app.search';
var STATE_COLORLIST = 'app.colorlist';
var STATE_DETAILS = 'app.details';
var STATE_LOCATOR_RESULT = 'app.colorlocatorresult';


angular.module('amazona.controllers', [])
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
.controller('DetailsCtrl', function($filter, $stateParams, $rootScope, $scope, $timeout, $state, $ionicHistory, MySettingsService,$ionicScrollDelegate) {
    //Validation
    $scope.isNotNumeric=function(value){
        return (isNaN(value));
    }
    //-----------
    
    $scope.formData = {};
    $scope.formData.formula=angular.fromJson($stateParams.formula);
    $scope.formData.overflowItem='';
    if($rootScope.unit !== undefined){
        $scope.formData.weight=$rootScope.unit;
    }else{
        $scope.formData.weight="K";
    }
    
    $scope.formData.mode='No';
    $scope.formData.totalQuantity=1;
    //Car Img function
    $scope.formData.carImgClass='amazona-details-car-img';
    $scope.toggleImageView = function() {
        if($scope.formData.carImgClass==='amazona-details-car-img'){
            $scope.formData.carImgClass='amazona-fullscreen-image';
            $scope.formData.overflowItem='amazona-visible-overflow';
        }else{
            $scope.formData.carImgClass='amazona-details-car-img';
            $scope.formData.overflowItem='';
        }
    };
    //************************
    
    //Basic color list
    $scope.formData.bColorsNormal=$scope.formData.formula.basicColors;
    
    $scope.formData.bColorsCumulative={};
    $scope.formData.bColorsCorrection={};
    var currentTotal=0;
    var colorsCount=Object.keys($scope.formData.bColorsNormal).length;
    $scope.formData.canvasHeight=colorsCount*35*1.5; //i give max 1.5 zoom limit
    for(i=0;i<colorsCount;i++){
        $scope.formData.bColorsCumulative[i] = {
            id_formula: $scope.formData.bColorsNormal[i].id_formula,
            colorImgPath: $scope.formData.bColorsNormal[i].colorImgPath,
            name_color: $scope.formData.bColorsNormal[i].name_color,
            quantite: $scope.formData.bColorsNormal[i].quantite,
            masse_volumique: $scope.formData.bColorsNormal[i].masse_volumique,
            toKiloConverter: $scope.formData.bColorsNormal[i].toKiloConverter
        };
        
        $scope.formData.bColorsCorrection[i] = {
            id_formula: $scope.formData.bColorsNormal[i].id_formula,
            colorImgPath: $scope.formData.bColorsNormal[i].colorImgPath,
            name_color: $scope.formData.bColorsNormal[i].name_color,
            quantite: $scope.formData.bColorsNormal[i].quantite,
            masse_volumique: $scope.formData.bColorsNormal[i].masse_volumique,
            toKiloConverter: $scope.formData.bColorsNormal[i].toKiloConverter,
            diff:'0'
        };
        
        
        $scope.formData.bColorsCorrection[i].quantite = $filter('roundNumber')($scope.formData.bColorsCorrection[i].quantite);
        
        $scope.formData.bColorsCumulative[i].quantite +=currentTotal;
        console.log("current total = " + currentTotal);
        console.log("$scope.formData.bColorsNormal[i].quantite = " + $scope.formData.bColorsNormal[i].quantite);
        currentTotal += $scope.formData.bColorsNormal[i].quantite;
        console.log("current total become = " + currentTotal);
    };
    //********************
    
    //Mode Managing
    $scope.doCorrection = function(){
        for(i=0;i<Object.keys($scope.formData.bColorsCorrection).length;i++){
            var convertToKiloMult = 1;
            if($scope.formData.weight === 'K'){
                //convertToKiloMult = $scope.formData.bColorsNormal[i].masse_volumique;
                convertToKiloMult = $scope.formData.bColorsNormal[i].toKiloConverter;
            }
            
            var correctionQty = $scope.formData.bColorsNormal[i].quantite * $scope.formData.totalQuantity * convertToKiloMult;
            
            $scope.formData.bColorsCorrection[i].quantite=$filter('roundNumber')(correctionQty);
            $scope.formData.bColorsCorrection[i].diff='0';
        }
    }
    $scope.calculateCorrection = function(indexChanged){
        var convertToKiloMult = 1;
        if($scope.formData.weight === 'K'){
            //convertToKiloMult = $scope.formData.bColorsNormal[indexChanged].masse_volumique;
            convertToKiloMult = $scope.formData.bColorsNormal[indexChanged].toKiloConverter;
        }
            
        var correctionQty = $scope.formData.bColorsCorrection[indexChanged].quantite;
        var normalQty = $scope.formData.bColorsNormal[indexChanged].quantite * $scope.formData.totalQuantity * convertToKiloMult;
        var corrMultiplyer = correctionQty/normalQty;
        for(i=0;i<Object.keys($scope.formData.bColorsCorrection).length;i++){
            if(i!==indexChanged){
                var convertToKiloMultOcc = 1;
                if($scope.formData.weight === 'K'){
                    //convertToKiloMultOcc = $scope.formData.bColorsNormal[i].masse_volumique;
                    convertToKiloMultOcc = $scope.formData.bColorsNormal[i].toKiloConverter;
                }
        
                var initQty = $scope.formData.bColorsNormal[i].quantite * convertToKiloMultOcc;
                $scope.formData.bColorsCorrection[i].quantite = $filter('roundNumber')(initQty * $scope.formData.totalQuantity * corrMultiplyer);
                if(i<indexChanged){
                    //TODO: we might need to multiply by convertToKiloMultOcc also
                    $scope.formData.bColorsCorrection[i].diff = $filter('roundNumber')(($scope.formData.bColorsCorrection[i].quantite) - initQty);
                    if($scope.formData.bColorsCorrection[i].diff >0){
                        $scope.formData.bColorsCorrection[i].diff = "+" + $scope.formData.bColorsCorrection[i].diff;
                    }else{
                        $scope.formData.bColorsCorrection[i].diff = "-" + $scope.formData.bColorsCorrection[i].diff;
                    }
                }
            }
        }
    };
    
    //****************************
    
    //zoom managing
    //$scope.formData.colorListHeight=$scope.dirHeight*2;
    //console.log("*************dirHeight" + $scope.dirHeight);
    
    $scope.cancelZoom = function(){
        $ionicScrollDelegate.zoomTo(1,true);
    }
    
    //-----------------
    
})
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
.controller('ColorlistCtrl', function($ionicLoading, $q, $stateParams, $rootScope, $scope, $timeout, $state, $ionicHistory, MySettingsService,SearchFormulasService,SearchColorsService) {
    $scope.formData = {};
    $scope.formData.searchObject=angular.fromJson($stateParams.searchObject);
    $scope.formData.carName=$scope.formData.searchObject.carName;
    $scope.formData.carImgPath=$scope.formData.searchObject.carImgPath;
    $scope.formData.carTableName=$scope.formData.searchObject.tableName;
    
    //Accordion
    $scope.pageData={};
    $scope.pageData.fetchSize=10;
    $scope.pageData.lastFetchFormula = {};
    $scope.pageData.lastFetchFormula.id_formula= "-1";
    $scope.pageData.lastFetchFormula.index=-1;
    
    //For duplicates control
    $scope.pageData.formula_id_used=[];
    //
    $scope.formulas = {};
    $scope.formulas.groups = [];
    $scope.formulas.allFormulas = [];

    $scope.loadMore = function() {
        console.log("formulas loading more");
        if($scope.formulas.allFormulas === undefined || $scope.formulas.allFormulas.length ===0){
            console.log("formulas not yet retrieved");
            return;
        }
        if(containsObject($scope.pageData.lastFetchFormula.id_formula, $scope.pageData.formula_id_used)){
            console.log("id more: " + $scope.pageData.lastFetchFormula_id + " contains in used; already got this group");
            return;
        }else{
            if($scope.formulas.groups.length>0){
                $scope.pageData.lastFetchFormula.id_formula = $scope.formulas.groups[$scope.formulas.groups.length - 1].id_formula;
                $scope.pageData.lastFetchFormula.index = $scope.formulas.groups.length - 1;
            }else{
                $scope.pageData.lastFetchFormula.id_formula = "-1";
                $scope.pageData.lastFetchFormula.index = -1;
            }
            $scope.pageData.formula_id_used.push($scope.pageData.lastFetchFormula.id_formula);
            
            var newGroup=[];
            var i=0;
            var count=0;
            for(i=$scope.pageData.lastFetchFormula.index + 1; count<10 && i<$scope.formulas.allFormulas.length; i++){
                newGroup[count]=$scope.formulas.allFormulas[i];
                count++;
            }
            $scope.formulas.groups = $scope.formulas.groups.concat(newGroup);
            
            
            $scope.pageData.lastFetchFormula.id_formula = $scope.formulas.groups[$scope.formulas.groups.length - 1].id_formula;
            $scope.pageData.lastFetchFormula.index = $scope.formulas.groups.length - 1;
            
            console.log("scroll broadcast - new last idFormula= " + $scope.pageData.lastFetchFormula.id_formula);
            console.log("scroll broadcast - new last index= " + $scope.pageData.lastFetchFormula.index);
            
            $scope.$broadcast('scroll.infiniteScrollComplete');
            
        }
        
    }
    
    $rootScope.stopLoadingMore=false;
    $scope.$on('$stateChangeSuccess', function() {
        console.log("stateChangeSuccess - attempt load more");
        
        //handling the case when going to the details page
        if($rootScope.stopLoadingMore === false){
            $scope.loadMore();
        }
        
    });
    
    $scope.moreDataCanBeLoaded = function(){
        if($scope.formulas.allFormulas === undefined){
            return false;
        }else{
            console.log("moreDataCanBeLoaded is called- $scope.formulas.groups.length=" + $scope.formulas.groups.length);
            console.log("moreDataCanBeLoaded is called- $scope.formulas.allFormulas.length=" + $scope.formulas.allFormulas.length);
            return $scope.formulas.groups.length < $scope.formulas.allFormulas.length;
        }
    }
    
    $ionicLoading.show({
        template: 'Loading...'
    }).then(function(){
        console.log("The loading indicator is now displayed");
    });
    SearchFormulasService.search($scope.formData.searchObject).then(
                function(formulaTab){
            
                    $scope.formulas.allFormulas = formulaTab;
                    $ionicLoading.hide().then(function(){
                        console.log("The loading indicator is now hidden");
                    });
                },
                function(error){
                    console.log("Error Search: " + error.message);
                }
            );
            
            
    
    
    

    
    $scope.pageData.filter={};
    $scope.pageData.filter.choice='ALL';
    $scope.filterFunction=function(chosenFilter,currentGroupType){
        if(chosenFilter==='ALL'){
            return currentGroupType;
        }else{
            return chosenFilter;
        }
        
    }
    /*
    * if given group is the selected group, deselect it
    * else, select the given group
    */
    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
          $scope.shownGroup = null;
        } else {
          $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };
    
    $scope.toggleFilter = function() {
        if ($scope.isFilterClicked()) {
          $scope.isFilterShown = false;
        } else {
          $scope.isFilterShown = true;
        }
    };
    
    $scope.isFilterClicked = function() {
        return $scope.isFilterShown === true;
    };
                                
                            
    $scope.pageData.sort={};
    $scope.pageData.sort.choice='';
    $scope.pageData.sort.chosenSort={};
    $scope.pageData.sort.chosenSort.type='';
    
    $scope.toggleSorter = function() {
        if ($scope.isSorterClicked()) {
          $scope.isSorterShown = false;
        } else {
          $scope.isSorterShown = true;
        }
    };
    
    $scope.stopAllSortExceptFor = function(exceptSort) {
        if(exceptSort != 'codeSort'){
            $scope.pageData.codeSort=0;
            $scope.pageData.sort.codeSelectedClass="";
        }
        if(exceptSort != 'typeSort'){
            $scope.pageData.typeSort=0;
            $scope.pageData.sort.typeSelectedClass="";
        }
        if(exceptSort != 'nameSort'){
            $scope.pageData.nameSort=0;
            $scope.pageData.sort.nameSelectedClass="";
        }
        if(exceptSort != 'yearSort'){
            $scope.pageData.yearSort=0;
            $scope.pageData.sort.yearSelectedClass="";
        }
        if(exceptSort != 'hueSort'){
            $scope.pageData.hueSort=0;
            $scope.pageData.sort.hueSelectedClass="";
        }
        if(exceptSort != 'cardSort'){
            $scope.pageData.cardSort=0;
            $scope.pageData.sort.cardSelectedClass="";
        }
    };
    
    $scope.isSorterClicked = function() {
        //initiate chosenSort
        
        
        return $scope.isSorterShown === true;
    };
    $scope.pageData.sort.arrowClass='';
    $scope.pageData.sort.codeSelectedClass='';
    $scope.pageData.sort.typeSelectedClass='';
    $scope.pageData.sort.nameSelectedClass='';
    $scope.pageData.sort.yearSelectedClass='';
    $scope.pageData.sort.hueSelectedClass='';
    $scope.pageData.sort.cardSelectedClass='';
    
    /*sort criterias*/
    $scope.pageData.codeSort=0;
    $scope.pageData.typeSort=0;
    $scope.pageData.nameSort=0;
    $scope.pageData.yearSort=0;
    $scope.pageData.hueSort=0;
    $scope.pageData.cardSort=0;
    
    $scope.cancelSort = function(){
        //alert("cancel sort");
        $scope.stopAllSortExceptFor('');
        $scope.pageData.chosenSortReverse=false;
        $scope.pageData.sort.chosenSort.type='';
    }
    //initialize sorting by code ascending
    //
    
    $scope.clickType=function() {
        $scope.pageData.sort.chosenSort.type="Type";
        $scope.stopAllSortExceptFor('typeSort');
        $scope.pageData.sort.typeSelectedClass="amazona-selected-sort";
        if($scope.pageData.typeSort===0){
            $scope.pageData.typeSort=1;
            $scope.pageData.sort.arrowClass='ion-chevron-down';
            $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-down';
        }else{
            if($scope.pageData.typeSort===1){
                $scope.pageData.typeSort=2;
                $scope.pageData.sort.arrowClass='ion-chevron-up';
                $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-up';
            }else{
                if($scope.pageData.typeSort===2){
                    $scope.pageData.typeSort=1;
                    $scope.pageData.sort.arrowClass='ion-chevron-down';
                    $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-down';
                }
            }
        }
    };
    $scope.clickCode=function() {
        $scope.pageData.sort.chosenSort.type="Code";
        $scope.stopAllSortExceptFor('codeSort');
        $scope.pageData.sort.codeSelectedClass="amazona-selected-sort";
        if($scope.pageData.codeSort===0){
            $scope.pageData.codeSort=1;
            $scope.pageData.sort.arrowClass='ion-chevron-down';
            $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-down';
        }else{
            if($scope.pageData.codeSort===1){
                $scope.pageData.codeSort=2;
                $scope.pageData.sort.arrowClass='ion-chevron-up';
                $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-up';
            }else{
                if($scope.pageData.codeSort===2){
                    $scope.pageData.codeSort=1;
                    $scope.pageData.sort.arrowClass='ion-chevron-down';
                    $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-down';
                }
            }
        }
    };
    $scope.clickName=function() {
        $scope.pageData.sort.chosenSort.type="Name";
        $scope.stopAllSortExceptFor('nameSort');
        $scope.pageData.sort.nameSelectedClass="amazona-selected-sort";
        if($scope.pageData.nameSort===0){
            $scope.pageData.nameSort=1;
            $scope.pageData.sort.arrowClass='ion-chevron-down';
            $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-down';
        }else{
            if($scope.pageData.nameSort===1){
                $scope.pageData.nameSort=2;
                $scope.pageData.sort.arrowClass='ion-chevron-up';
                $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-up';
            }else{
                if($scope.pageData.nameSort===2){
                    $scope.pageData.nameSort=1;
                    $scope.pageData.sort.arrowClass='ion-chevron-down';
                    $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-down';
                }
            }
        }
    };
    
    $scope.clickYear=function() {
        $scope.pageData.sort.chosenSort.type="Year";
        $scope.stopAllSortExceptFor('yearSort');
        $scope.pageData.sort.yearSelectedClass="amazona-selected-sort";
        if($scope.pageData.yearSort===0){
            $scope.pageData.yearSort=1;
            $scope.pageData.sort.arrowClass='ion-chevron-down';
            $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-down';
        }else{
            if($scope.pageData.yearSort===1){
                $scope.pageData.yearSort=2;
                $scope.pageData.sort.arrowClass='ion-chevron-up';
                $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-up';
            }else{
                if($scope.pageData.yearSort===2){
                    $scope.pageData.yearSort=1;
                    $scope.pageData.sort.arrowClass='ion-chevron-down';
                    $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-down';
                }
            }
        }
    };
    
    $scope.clickHue=function() {
        $scope.pageData.sort.chosenSort.type="Hue";
        $scope.stopAllSortExceptFor('hueSort');
        $scope.pageData.sort.hueSelectedClass="amazona-selected-sort";
        if($scope.pageData.hueSort===0){
            $scope.pageData.hueSort=1;
            $scope.pageData.sort.arrowClass='ion-chevron-down';
            $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-down';
        }else{
            if($scope.pageData.hueSort===1){
                $scope.pageData.hueSort=2;
                $scope.pageData.sort.arrowClass='ion-chevron-up';
                $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-up';
            }else{
                if($scope.pageData.hueSort===2){
                    $scope.pageData.hueSort=1;
                    $scope.pageData.sort.arrowClass='ion-chevron-down';
                    $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-down';
                }
            }
        }
    };
    
    $scope.clickCard=function() {
        $scope.pageData.sort.chosenSort.type="Card";
        $scope.stopAllSortExceptFor('cardSort');
        $scope.pageData.sort.cardSelectedClass="amazona-selected-sort";
        if($scope.pageData.cardSort===0){
            $scope.pageData.cardSort=1;
            $scope.pageData.sort.arrowClass='ion-chevron-down';
            $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-down';
        }else{
            if($scope.pageData.cardSort===1){
                $scope.pageData.cardSort=2;
                $scope.pageData.sort.arrowClass='ion-chevron-up';
                $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-up';
            }else{
                if($scope.pageData.cardSort===2){
                    $scope.pageData.cardSort=1;
                    $scope.pageData.sort.arrowClass='ion-chevron-down';
                    $scope.pageData.sort.chosenSort.arrowClass='ion-chevron-down';
                }
            }
        }
    };
    $scope.pageData.chosenSortReverse=false;
    /*$scope.pageData.codeSort=1;
    $scope.clickCode();*/
    
    $scope.getChosenSort = function(){
        if($scope.pageData.codeSort > 0){
            if($scope.pageData.codeSort ==1){
                $scope.pageData.chosenSortReverse=true;
            }else{
                $scope.pageData.chosenSortReverse=false;
            }
            return "colorCode";
        }else{
            if($scope.pageData.typeSort > 0){
                if($scope.pageData.typeSort ==1){
                    $scope.pageData.chosenSortReverse=true;
                }else{
                    $scope.pageData.chosenSortReverse=false;
                }
                return "type";
            }else{
                if($scope.pageData.nameSort > 0){
                    if($scope.pageData.nameSort ==1){
                        $scope.pageData.chosenSortReverse=true;
                    }else{
                        $scope.pageData.chosenSortReverse=false;
                    }
                    return "name_formula";
                }else{
                    if($scope.pageData.hueSort > 0){
                        if($scope.pageData.hueSort ==1){
                            $scope.pageData.chosenSortReverse=true;
                        }else{
                            $scope.pageData.chosenSortReverse=false;
                        }
                        return "version";
                    }else{
                        if($scope.pageData.cardSort > 0){
                            if($scope.pageData.cardSort ==1){
                                $scope.pageData.chosenSortReverse=true;
                            }else{
                                $scope.pageData.chosenSortReverse=false;
                            }
                            return "cardNumber";
                        }else{
                            if($scope.pageData.yearSort > 0){
                                if($scope.pageData.yearSort ==1){
                                    $scope.pageData.chosenSortReverse=true;
                                }else{
                                    $scope.pageData.chosenSortReverse=false;
                                }
                                return "c_year";
                            }else{
                                /*$scope.pageData.chosenSortReverse=false;
                                return "id_formula";*/
                            }
                        }
                    }
                }
            }
        }
    };
    $scope.isNameSortClicked = function() {
        return $scope.pageData.nameSort >0;
    };
    $scope.isTypeSortClicked = function() {
        return $scope.pageData.typeSort >0;
    };
    $scope.isCodeSortClicked = function() {
        return $scope.pageData.codeSort >0;
    };
    $scope.isYearSortClicked = function() {
        return $scope.pageData.yearSort >0;
    };
    $scope.isHueSortClicked = function() {
        return $scope.pageData.hueSort >0;
    };
    $scope.isCardSortClicked = function() {
        return $scope.pageData.cardSort >0;
    };
    //-----------
    
    $scope.showColorComposed= function(formula, id_formulaComposed){
        $scope.showColor(formula, id_formulaComposed);
    }
    
    $scope.showColor = function(formula, id_formulaComposed){
        var tableName = $scope.formData.carTableName + "_formulaColor";
        //check if is bumper
        var isCouche = SearchFormulasService.isCouche(formula.name_formula);
        var isBumper = false;
        
        if(formula.colorCode.toLowerCase().endsWith("bumper")){
            isBumper = true;
        }
            
        if(isBumper){
            var searchObjectByIdFormula={
                    id_car: $scope.formData.searchObject.id_car,
                    carName: $scope.formData.searchObject.carName,
                    carImgPath: $scope.formData.searchObject.carImgPath,
                    tableName: $scope.formData.searchObject.tableName,
                    name_formula: '',
                    c_year: '',
                    colorCode: '',
                    cardNumber: '',
                    id_formula: formula.id_formulaX
                };
                
            SearchFormulasService.search(searchObjectByIdFormula).then(
                    function(formulaTab){
                        var bumperFormula = formulaTab[0];
                        var isApply4201_180Eq = bumperFormula.isEquation4201_180;
                        SearchColorsService.search(bumperFormula.id_formula,tableName,bumperFormula.type, isCouche, isApply4201_180Eq).then(
                            function(basicColorsDB){
                                //debugger;
                                bumperFormula.basicColors=basicColorsDB;
                                var bumperFormulaAngular = angular.toJson(bumperFormula);
                                $rootScope.stopLoadingMore = true;
                                //debugger;
                                $state.go(STATE_DETAILS, { formula: bumperFormulaAngular});
                            }
                        );
                    },
                    function(error){
                        console.log("Error Search: " + error.message);
                    }
                );
            //---------------------
        }else{
            if(id_formulaComposed>0){//composed
                var searchObjectByIdFormula={
                    id_car: $scope.formData.searchObject.id_car,
                    carName: $scope.formData.searchObject.carName,
                    carImgPath: $scope.formData.searchObject.carImgPath,
                    tableName: $scope.formData.searchObject.tableName,
                    name_formula: '',
                    c_year: '',
                    colorCode: '',
                    cardNumber: '',
                    id_formula: id_formulaComposed
                };
                
                SearchFormulasService.search(searchObjectByIdFormula).then(
                        function(formulaTab){
                            var composedFormulaPart = formulaTab[0];
                            var isApply4201_180Eq = composedFormulaPart.isEquation4201_180;
                            SearchColorsService.search(composedFormulaPart.id_formula,tableName,composedFormulaPart.type,isCouche,isApply4201_180Eq).then(
                                function(basicColorsDB){
                                    //debugger;
                                    composedFormulaPart.basicColors=basicColorsDB;
                                    var composedFormulaPartAngular = angular.toJson(composedFormulaPart);
                                    $rootScope.stopLoadingMore = true;
                                    //debugger;
                                    $state.go(STATE_DETAILS, { formula: composedFormulaPartAngular});
                                }
                            );
                        },
                        function(error){
                            console.log("Error Search: " + error.message);
                        }
                    );
                //---------------------
                
            }else{//normal case
                var isApply4201_180Eq = formula.isEquation4201_180;
                SearchColorsService.search(formula.id_formula,tableName,formula.type,isCouche,isApply4201_180Eq).then(
                    function(basicColorsDB){
                        //debugger;
                        formula.basicColors=basicColorsDB;
                        var formulaAngular = angular.toJson(formula);
                        $rootScope.stopLoadingMore = true;
                        //debugger;
                        $state.go(STATE_DETAILS, { formula: formulaAngular});
                    }
                );
            }
        }
        
    }
})
.controller('HomeCtrl', function($ionicPopup, $rootScope, $scope, $state, $ionicHistory,$timeout, MyLoginService,MySyncService) {
    
    //----syncing notification
    /*
     MySyncService.getForceSync().then(function(force){
        if(force===1){
            $rootScope.forceSync=1;
            $scope.doLogout();
        }
    })
    //$http.get('http://www.amazonapaints.com/dbSync/').then(
    myHttpService.getSyncData().then(
        function(responseData){
            //debugger;
            var totalJSONResponse=responseData;
            //var jsObject = JSON.parse(totalJSONResponse);
            var jsObject = totalJSONResponse;
            MySyncService.getCurrentVersionFromDB().then(
                function(val){
                    var currentLastUpdateVersion=val;
                    var updatesObj = jsObject.updates;
                    var versionIndexToUse = MySyncService.getVersionIndexToUse(updatesObj, currentLastUpdateVersion);
                    console.log("version index to start with: " + versionIndexToUse);
                   
                    if(versionIndexToUse !==-1){
                        $rootScope.forceSync=1;
                        $scope.doLogout();
                        
                    }
                },
                function(err){
                    console.error(err.message);
                }
            );
        },
        function(err){
            console.error(err.message);
        }
    );
*/
    
    
    //-----
    
    
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

    /*$timeout(function(){
             var container= document.getElementById("amazona-slider-container");
             var innersTab=document.getElementsByName("amazona-slider-inner");
             
             innersTab.forEach(function(inner) {
                               //var inner= document.getElementById("amazona-slider-inner");
                               debugger;
                               var inHeight=inner.offsetHeight;
                               //console.log("inHeight=" + inHeight);
                               
                               var conHeight=container.offsetHeight;
                               //console.log("conHeight=" + conHeight);
                               
                               var marginTopToSet = ((conHeight-inHeight)/2);
                               //console.log("marginTopToSet=" + marginTopToSet);
                               
                               inner.style.marginTop=marginTopToSet + "px";
                               //console.log("marginTop=" + inner.style.marginTop);
                               
                               });
    }
    , 0)*/

})
.controller('ColorlocatorresultCtrl', function($timeout, $rootScope, $scope, $state, $ionicHistory, $stateParams, $window, $ionicScrollDelegate) {
    //main navigation
    $scope.goHome = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go(STATE_AFTER_LOGIN);
        
    };
    //--------------
    //retrieve search demand
    $scope.formData = {};
    $scope.formData.searchObject=angular.fromJson($stateParams.searchObject);
    $scope.formData.markers=$scope.formData.searchObject.markers;
    //-------------------
    
    
    $scope.$on('$ionicView.afterEnter', function(){
        $scope.calculateSizes();
        //$scope.drawMarkers();
    });
    $scope.formData.resizeRatio=1;
    $scope.carImgInitialWidth= 454;
    $scope.carImgInitialHeight= 452;
    

    $scope.calculateSizes = function(){
        $scope.dev_width = $window.innerWidth;
        $scope.dev_height = $window.innerHeight;
        $scope.formData.resizeRatio = $scope.dev_width / $scope.carImgInitialWidth;
        
        $scope.canvas={};
        $scope.canvas.width = $scope.dev_width;
        $scope.canvas.height = $scope.dev_height;
    };
    
    $scope.drawMarkers = function(){
        //$scope.calculateSizes();
        var markers=$scope.formData.markers;
        if(markers === null){
            return;
        }
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        //draw car images
        var carImg = document.getElementById("colorLocatorImg");
        
        var imgWidth=$scope.carImgInitialWidth * $scope.formData.resizeRatio;
        var imgHeight=$scope.carImgInitialHeight * $scope.formData.resizeRatio;
        
        ctx.drawImage(carImg, 0, 0, imgWidth, imgHeight);
        //----------
        var locatorsXY = markers.split(";");
        var i=0;
        for(i=0;i<locatorsXY.length;i++){
            if(locatorsXY[i].indexOf(",")<0){
                continue;
            }
            var top = locatorsXY[i].split(",")[0].replace("px", "");
            var left = locatorsXY[i].split(",")[1].replace("px", "");
            if(top.indexOf("-")===0 || left.indexOf("-")===0 ){
                continue;
            }
            var img = document.getElementById("colorLocatorMarker");
            ctx.drawImage(img, left * $scope.formData.resizeRatio, top * $scope.formData.resizeRatio);
        }

    };
    $timeout(function(){
        $scope.drawMarkers();
    }, 1000);
     
    $scope.cancelZoom = function(){
        $ionicScrollDelegate.zoomTo(1,true);
    }
})
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
.controller('LoginCtrl', function($q,$rootScope, $scope, $timeout, $interval, $state, $ionicPopup, $ionicHistory,$ionicPlatform, MyLoginService,MySyncService) {

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


.controller('SynchappCtrl', function($ionicPopup, $ionicLoading, $q,$rootScope, $scope, $timeout, $interval, $state, $ionicHistory,$ionicPlatform, myHttpService, MySyncService) {

    //Validation
    $scope.formData = {};
    
    
  
  
     // Perform the synch
    $scope.doSynch = function() {
        $ionicLoading.show({
            template: 'Loading...'
        }).then(function(){
            console.log("The loading indicator is now displayed");
        });
        
        
        //$http.get('http://www.amazonapaints.com/stopsyncindex/').then(
        /*myHttpService.getStopSyncData().then(
            function(responseData){
                var jsObjectStopSync=responseData;
                console.log("jsObjectStopSync=" + jsObjectStopSync);
                MySyncService.getStopSyncIndex().then(
                    function(val){
                        console.log("jsObjectStopSync-val=" + val);
                        if(val<jsObjectStopSync){
                            $ionicLoading.hide().then(function(){
                                console.log("The loading indicator is now hidden");
                                $ionicLoading.hide().then(function(){
                                    console.log("The loading indicator is now hidden");
                                });
                                var myPopup = $ionicPopup.show({
                                    title: 'Sync',
                                    subTitle: 'You can no longer sync this version of this app, you must update it from the store in order to get the newest data',
                                    scope: $scope,
                                    buttons: [
                                      {
                                        text: '<b>OK</b>',
                                        type: 'button-positive',
                                      }
                                    ]
                                  });
                            });
                        }else{
                            $ionicLoading.hide().then(function(){
                                console.log("The loading indicator is now hidden");
                            });
                            var myPopup = $ionicPopup.show({
                            title: 'Sync',
                            subTitle: 'Are you sure you want to perform the sync action? <BR> This action could take a while depending on the last time you updated your app',
                            scope: $scope,
                            buttons: [
                              { text: 'Cancel' },
                              {
                                text: '<b>OK</b>',
                                type: 'button-positive',
                                onTap: function(e) {
                                    console.log('Doing synch');
                                    $ionicLoading.show({
                                        template: 'Loading...'
                                    }).then(function(){
                                        console.log("The loading indicator is now displayed");
                                    });
                                    $scope.doRequest();
                                }
                              }
                            ]
                            });
                        }
                    },
                    function(err){
                        $scope.synVersionMessage = "Sync action cannot be executed. Couldn't get current version from DB";
                        $scope.labelColorClass = "label-color-error";
                        console.error(err.message);
                        $ionicLoading.hide().then(function(){
                            console.log("The loading indicator is now hidden");
                        });
                    });
                },
            function(err){
                $scope.synVersionMessage = "Sync action cannot be executed. Please make sure this app has access to the internet.<br>If you are connected to the internet please update your app from the google play or app store.";
                $scope.labelColorClass = "label-color-error";
                console.error(err.message);
                $ionicLoading.hide().then(function(){
                    console.log("The loading indicator is now hidden");
                });
            });
        */
    };

    $scope.synVersionMessage = "";
    $scope.labelColorClass = "";
                                
    MySyncService.getCurrentVersionFromDB().then(
        function(val){
            $rootScope.currentLastUpdateVersion = val;
        },
        function(err){
            console.error(err);
        });

            
    $scope.doRequest = function(){
    
        
        var _condigHeader = {
            headers: {
                'Content-Type' : 'text/plain'
            }
        };
        
        //$http.get('http://www.amazonapaints.com/dbSync/').then(
        /*myHttpService.getSyncData().then(
            function(responseData){
                //debugger;
                var totalJSONResponse=responseData;
                //var jsObject = JSON.parse(totalJSONResponse);
                var jsObject = totalJSONResponse;
                MySyncService.getCurrentVersionFromDB().then(
                    function(val){
                        var currentLastUpdateVersion=val;
                        var updatesObj = jsObject.updates;
                        var versionIndexToUse = MySyncService.getVersionIndexToUse(updatesObj, currentLastUpdateVersion);
                        console.log("version index to start with: " + versionIndexToUse);
                       
                        if(versionIndexToUse ===-1){
                           console.log("No new versions to sync");
                           $scope.synVersionMessage = "No new versions to sync";
                           $scope.labelColorClass = "label-color-success";
                           $ionicLoading.hide().then(function(){
                                console.log("The loading indicator is now hidden");
                            });
                        }else{
                            MySyncService.loopThroughVersions(jsObject,versionIndexToUse).then( function(){
                                
                                $rootScope.currentLastUpdateVersion = $scope.getLastVersion(updatesObj);
                                MySyncService.updateVersionRow($rootScope.currentLastUpdateVersion);
                                var messageSuccess="Version synced successfully, new version set to : " + $rootScope.currentLastUpdateVersion;
                                console.log(messageSuccess);
                                $rootScope.forceSync=false;
                                MySyncService.setForceSync(0);
                                //alert("version synced successfully, new version set to: " + $rootScope.currentLastUpdateVersion);
                                $scope.synVersionMessage = messageSuccess;
                                $scope.labelColorClass = "label-color-success";
                                $ionicLoading.hide().then(function(){
                                    console.log("The loading indicator is now hidden");
                                });
                            },function(err){
                                $scope.synVersionMessage = "Error in sync, version is " + $rootScope.currentLastUpdateVersion + " - " + err.message;
                                $scope.labelColorClass = "label-color-error";
                                console.error(err);
                                $ionicLoading.hide().then(function(){
                                    console.log("The loading indicator is now hidden");
                                });
                            },function(notification){
                                console.log("version in progress=" + notification);
                                $rootScope.currentLastUpdateVersion  = notification;
                            });
                       }
                    }, function(err){
                        $scope.synVersionMessage = "Sync action cannot be executed. Couldn't get current version from DB";
                        $scope.labelColorClass = "label-color-error";
                        console.error(err.message);
                        $ionicLoading.hide().then(function(){
                            console.log("The loading indicator is now hidden");
                        });
                    }
                );
        }, function(err){
            $scope.synVersionMessage = "Sync action cannot be executed. Please make sure this app has access to the internet.";
            $scope.labelColorClass = "label-color-error";
            console.error(err.message);
            $ionicLoading.hide().then(function(){
                console.log("The loading indicator is now hidden");
            });
        });*/
            

    };
    $scope.getLastVersion = function(updatesObj){
        var numberOfUpdate = updatesObj.length;
        var theVersion = updatesObj[numberOfUpdate-1].version;
        return theVersion;
    }
    
    
})


.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicHistory, $rootScope, $state, MyLoginService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  /*$scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };*/
    $rootScope.$resetRootScope = function() {
        $rootScope.connected="0";
        delete $rootScope.chosenGarage;
        
    }
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
        $ionicHistory.clearCache().then(
            function(){
                var forceSync=$rootScope.forceSync;
                $rootScope.$resetRootScope();
                $rootScope.forceSync=forceSync;
                $state.go(STATE_LOGOUT);
            }
        )
    }

});
