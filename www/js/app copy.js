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

app.run(function($rootScope, $ionicPlatform, $cordovaSQLite, MySettingsService, getAllCarsService,createTablesService,initiateDataService) {
	$ionicPlatform.ready(function() {
		console.log("mike ionicPlatform ready");
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs).
		// The reason we default this to hidden is that native apps don't usually show an accessory bar, at
		// least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
		// useful especially with forms, though we would prefer giving the user a little more room
		// to interact with the app.
		if (window.cordova && window.Keyboard) {
		  window.Keyboard.hideKeyboardAccessoryBar(true);
		}
	
		if (window.StatusBar) {
		  // Set the statusbar to use the default style, tweak this to
		  // remove the status bar on iOS or change it to use white instead of dark colors.
		  StatusBar.styleDefault();
		}
		document.addEventListener("deviceready", function () {
			console.log("mike device ready");
			debugger;
			if (window.sqlitePlugin !== undefined) {
			  // debugging in the device
				console.log("window.sqlitePlugin !== undefined");
				alert("window.sqlitePlugin !== undefined");
			}else{
				console.log("window.sqlitePlugin == undefined");
				alert("window.sqlitePlugin !== undefined");
			}
		});
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
  $urlRouterProvider.otherwise('/app/about');
});
