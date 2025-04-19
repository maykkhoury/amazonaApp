angular.module('amazona.controllers')
.controller('DetailsCtrl', function($filter, $stateParams, $rootScope, $scope ,$ionicScrollDelegate) {
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