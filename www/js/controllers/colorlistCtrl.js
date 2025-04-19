var STATE_DETAILS = 'app.details';

angular.module('amazona.controllers')
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