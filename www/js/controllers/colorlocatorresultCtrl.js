var STATE_AFTER_LOGIN = 'app.home';

angular.module('amazona.controllers')
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