// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'amazona' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'amazona.controllers' is found in controllers.js

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function containsObject(obj, list) {
    var i;
	console.log("list.length="+list.length);
    for (i = 0; i < list.length; i++) {
		console.log("list[i]=" + list[i] + " - obj="+obj);
        if (list[i] === obj) {
			console.log("equals");
            return true;
        }else{
			console.log("not equals");
		}
    }

    return false;
}
/*
function containsObjectFormula(obj, list) {
    var i;
	console.log("formula list.length="+list.length);
    for (i = 0; i < list.length; i++) {
		console.log("formula list[i]=" + list[i].id_formula + " - obj="+obj.id_formula);
        if (list[i].id_formula === obj.id_formula) {
			console.log("formula equals");
            return true;
        }else{
			console.log("formula not equals");
		}
    }

    return false;
}
*/

var db = null;
function selectStuffForTest($cordovaSQLite){
	//debugger;
	var query = "";
	var queryValues=[];
        $cordovaSQLite.execute(db, query, queryValues).then(function(res) {
			//debugger;
            if(res.rows.length > 0) {
                console.log("SELECTED -> " + res.rows.item(0).garage_key + " " + res.rows.item(0).garage_name);
            } else {
                console.log("No results found");
            }
        }, function (err) {
			//debugger;
            console.error("selectStuffForTest:" + err);
        });
}

var app = angular.module('amazona', ['ionic', 'ngCordova', 'amazona.controllers', 'amazona.services']);

app.run(function($cordovaFileTransfer, $rootScope, $ionicPlatform, $cordovaSQLite, MySettingsService, getAllCarsService,createTablesService,initiateDataService) {
  $ionicPlatform.ready(function() {
	console.log("app.run ready");
	  // Hide splash screen
    setTimeout(function() {
        navigator.splashscreen.hide();
	}, 1000);
    
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
	/*if (window.cordova && window.Keyboard) {
		window.Keyboard.hideKeyboardAccessoryBar(true);
		window.Keyboard.disableScroll(true);
    }*/
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
	
	//DB Declaration
	$rootScope.connected="0";
	/*try{
		//debugger;
		$cordovaSQLite.deleteDB("amazona.db");
	}catch(error){
		console.log(error);
	}*/
	$rootScope.unit = "L";
	$rootScope.garageChosenDone=false;
	//debugger;
	document.addEventListener("deviceready", function () {
		console.log("devide ready fired");
		//debugger;
		if (window.sqlitePlugin !== undefined) {
		// debugging in the device
			//alert("window.sqlitePlugin !== undefined");
			console.log("window.sqlitePlugin !== undefined");
		//db = $cordovaSQLite.openDB({name: 'amazona.db', iosDatabaseLocation: 'default'});
			//alert("before sqlDB");
			//http://www.amazonapaints.com/amazonaDB-1.db
			console.log(cordova.file);
			debugger;
			var storagePath="";
			if (ionic.Platform.isIOS()) {
				storagePath = cordova.file.cacheDirectory + "/temp";
			}else {
				if(ionic.Platform.isAndroid()){
					storagePath = cordova.file.cacheDirectory + "/amazonaApp/temp";
				}
			}

			var fileTransfer = new FileTransfer();
			var url="http://www.amazonapaints.com/splash.jpg";
			var uri = encodeURI(url);

			fileTransfer.download(
				uri,
				storagePath,
				function(entry) {
					debugger;
					console.log(entry.filesystem);
					console.log(entry.fileSystem);

					console.log("download complete: " + entry.toURL());
				},
				function(error) {
					debugger;
					console.log("download error source " + error.source);
					console.log("download error target " + error.target);
					console.log("download error code" + error.code);
				},
				false
			);


			

			window.plugins.sqlDB.copy("amazonaDB-1.db", 0, function() {
				console.log("window.sqlitePlugin !== undefined: 108");
				//alert("ok");
				db = $cordovaSQLite.openDB({name: 'amazonaDB-1.db', iosDatabaseLocation: 'default'});
				if(db === undefined){
					console.log("db is undefined");
				}else{
					console.log("db is not undefined"+db);
				}

				/*MySettingsService.getChosenGarage().then(
					function(val){
						$rootScope.chosenGarage = val;
						$rootScope.showAllHues=$rootScope.chosenGarage.showAll ==="1";*/
						getAllCarsService.getCars().then(
							function(val){
								console.log("app.run got cars");
								$rootScope.cars = val;
							}
						);
					/*},
					function(err){
						alert("error promise app:" + err.message);
					}
				);*/
													
			}, function(error) {
				//alert("error:"+error.message);
				console.log("error:"+error.message);
				console.log("There was an error copying the database: " + error);
				db = $cordovaSQLite.openDB({name: 'amazonaDB-1.db', iosDatabaseLocation: 'default'});
				
				/*MySettingsService.getChosenGarage().then(
					function(val){
						$rootScope.chosenGarage = val;
						$rootScope.showAllHues=$rootScope.chosenGarage.showAll ==="1";*/
						getAllCarsService.getCars().then(
							function(val){
								$rootScope.cars = val;
							}
						);
				/*	},
					function(err){
						alert("error promise app:" + err.message);
					}
				);*/
				
			});
			
		} else {
		// debugging in the browser	
			//alert("window.sqlitePlugin === undefined");
			console.log("window.sqlitePlugin === undefined");
			/*window.sqlitePlugin.sqlDB.copy("amazonaDB-1.db", function() {*/
		
				db = window.openDatabase("C:\hybridworkspaces\amazonaApp\www\amazonaDB-1.db", "1.0", "Database", 200000);
				
				/*MySettingsService.getChosenGarage().then(
					function(val){
						$rootScope.chosenGarage = val;
						$rootScope.showAllHues=$rootScope.chosenGarage.showAll ==="1";*/
						getAllCarsService.getCars().then(
							function(val){
								$rootScope.cars = val;
							}
						);
					/*},
					function(err){
						alert("error promise app:" + err.message);
					}
				);*/
				
			/*}, function(error) {
				console.error("There was an error copying the database: " + error);
				db = window.openDatabase("amazonaDB-1.db", "1.0", "Database", 200000);
			});*/
			
			//db = window.openDatabase("amazonaDB-1.db", "1.0", "Database", 200000);
		//}

		//debugger;
		
		$cordovaSQLite.execute(db, "DROP table garage");
		$cordovaSQLite.execute(db, "DROP table car");
		$cordovaSQLite.execute(db, "DROP table Alfa_Romeo");
		$cordovaSQLite.execute(db, "DROP table Aston_Martin");
		$cordovaSQLite.execute(db, "DROP table Alfa_Romeo_formulaColor");
		$cordovaSQLite.execute(db, "DROP table Aston_Martin_formulaColor");
		$cordovaSQLite.execute(db, "DROP table color");
		
		
		//create tables 
		
		
		createTablesService.createGarages().then(
			function(){
				createTablesService.createCars().then(
					function(){
						createTablesService.createFormula("Alfa_Romeo").then(
							function(){
								createTablesService.createFormulaColor("Alfa_Romeo_formulaColor").then(
									function(){
										createTablesService.createFormula("Aston_Martin").then(
											function(){
												createTablesService.createFormulaColor("Aston_Martin_formulaColor").then(
													function(){
														createTablesService.createBasicColor().then(
															function(){
																initiateDataService.insertGarage().then(
																	function(){
																		/*initiateDataService.insertCars().then(
																			function(){
																				initiateDataService.insertColors().then(
																					function(){
																						initiateDataService.insertFormulas().then(
																							function(){
																								initiateDataService.insertFormulaColors().then(
																									function(){
																										MySettingsService.getChosenGarage().then(
																											function(val){
																												$rootScope.chosenGarage = val;
																												$rootScope.showAllHues=$rootScope.chosenGarage.showAll ==="1";
																												getAllCarsService.getCars().then(
																													function(val){
																														$rootScope.cars = val;
																													}
																												);
																											}
																										);
																									}
																								);
																							}
																						);
																					}
																				);
																			}
																		);*/
																	}
																);
															}
														);
													}
												);
											}
										);
									}
								);
							}
						);
					}
				);
			}
		);
	}
	});
	
	//selectStuffForTest($cordovaSQLite);
	//debugger;
	
  });
})
.filter('roundNumber', function() {
    return function(x) {
        return parseFloat(Math.round(x * 100) / 100).toFixed(1);
    };
})
/*
.directive('getElementWidthHeight', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
			console.log("*****ingetElementWidthHeight " + element.prop('offsetHeight') + " " + element.prop('offsetWidth'));
            scope.dirHeight = element.prop('offsetHeight');
            scope.dirWidth = element.prop('offsetWidth');
        }
    };
})

*/
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.details', {
    url: '/details:formula',
    views: {
      'menuContent': {
        templateUrl: 'templates/details.html',
        controller: 'DetailsCtrl'
      }
    }
  })
  
  .state('app.colorlist', {
    url: '/colorlist:searchObject',
    views: {
      'menuContent': {
        templateUrl: 'templates/colorlist.html',
        controller: 'ColorlistCtrl'
      }
    }
  })
  
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    }
  })
  
  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
		controller: 'LoginCtrl'
      }
    }
  })
  .state('app.logout', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
		controller: 'LoginCtrl'
      }
    }
  })
  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
		controller: 'SettingsCtrl'
      }
    }
  })
  .state('app.home', {
	cache: false,
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
		controller: 'HomeCtrl'
      }
    }
  })
	.state('app.colorlocator', {
      url: '/colorlocator',
      views: {
        'menuContent': {
          templateUrl: 'templates/colorlocator.html',
          controller: 'ColorlocatorCtrl'
        }
      }
    })
	.state('app.colorlocatorresult', {
      url: '/colorlocatorresult:searchObject',
      views: {
        'menuContent': {
          templateUrl: 'templates/colorlocatorresult.html',
          controller: 'ColorlocatorresultCtrl'
        }
      }
    })
    .state('app.contactus', {
      url: '/contactus',
      views: {
        'menuContent': {
          templateUrl: 'templates/contactus.html',
          controller: 'ContactusCtrl'
        }
      }
    })
	.state('app.synchapp', {
      url: '/synchapp',
      views: {
        'menuContent': {
          templateUrl: 'templates/synchapp.html',
          controller: 'SynchappCtrl'
        }
      }
    })
  .state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html',
        controller: 'AboutCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
