angular.module('amazona.services')
.service("getAllCarsService", function($q, $cordovaSQLite) {
    var serviceSelf=this;		
		
    serviceSelf.getCars=function() {
        //alert("getCars")
        var lePromise=$q.defer();
        var query = "SELECT * from car order by carName asc";
        //debugger;
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            //debugger;
            if(res.rows.length > 0) {
                var cars=[];
                var i=0;
                for(i=0;i<res.rows.length;i++){
                    cars[i]=res.rows.item(i);
                    console.log("SELECTED -> " + res.rows.item(i).carName);
                }
                    
                lePromise.resolve(cars);
            } else {
                console.log("No cars found");
                lePromise.resolve(null);
            }
        }, function (err) {
            console.log(err.message);
            lePromise.error(err);
        });

        
        return lePromise.promise;
    };
    
    serviceSelf.getCarNamesWithLocators=function() {
        //alert("getCars")
        var lePromise=$q.defer();
        var query = "Select distinct(carname) as carName FROM colorLocator order by carname";
        //debugger;
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            //debugger;
            if(res.rows.length > 0) {
                var carsWithLocators=[];
                var i=0;
                for(i=0;i<res.rows.length;i++){
                    carsWithLocators[i]={"id" : i, "carName" : res.rows.item(i).carName};
                    //carsWithLocators[i]=res.rows.item(i).carName;
                }
                    
                lePromise.resolve(carsWithLocators);
            } else {
                console.log("No cars found");
                lePromise.resolve(null);
            }
        }, function (err) {
            console.log(err.message);
            lePromise.error(err);
        });

        
        return lePromise.promise;
    };
    
    serviceSelf.getCarModels=function(carName) {
        var lePromise=$q.defer();
        var query = "Select distinct(carmodel) as model FROM [colorLocator] where lower(carname)=?";
        //debugger;
        $cordovaSQLite.execute(db, query, [carName.toLowerCase()]).then(function(res) {
            //debugger;
            if(res.rows.length > 0) {
                var models=[];
                var i=0;
                var count=0;
                models[count]={"model" : "all"};
                count++;
                for(i=0;i<res.rows.length;i++){
                    if(res.rows.item(i).model.toLowerCase() !== 'all'){
                        models[count]={"model" : res.rows.item(i).model};
                        count++;
                    }
                }
                lePromise.resolve(models);
            } else {
                console.log("No model found");
                lePromise.resolve(null);
            }
        }, function (err) {
            console.log(err.message);
            lePromise.error(err);
        });
        return lePromise.promise;
    };
    
    serviceSelf.getCarYears=function(carName, model) {
        var lePromise=$q.defer();
        var query = "Select distinct(caryear) as year FROM [colorLocator] where lower(carname)=? and lower(carmodel)=?";
        //debugger;
        $cordovaSQLite.execute(db, query, [carName.toLowerCase(), model.toLowerCase()]).then(function(res) {
            //debugger;
            if(res.rows.length > 0) {
                var years=[];
                var i=0;
                var count=0;
                years[count]={"year" : "all"};
                count++;
                for(i=0;i<res.rows.length;i++){
                    if(res.rows.item(i).year.toLowerCase() !== 'all'){
                        years[count]={"year" : res.rows.item(i).year};
                        count++;
                    }
                }
                lePromise.resolve(years);
            } else {
                console.log("No year found");
                lePromise.resolve(null);
            }
        }, function (err) {
            console.log(err.message);
            lePromise.error(err);
        });
        return lePromise.promise;
    };
    
    serviceSelf.getLocators=function(carName, model, year) {
        var lePromise=$q.defer();
        var query = "Select locators FROM [colorLocator] where lower(carname)=? and lower(carmodel)=? and lower(caryear)=?";
        //debugger;
        $cordovaSQLite.execute(db, query, [carName.toLowerCase(), model.toLowerCase(),year.toLowerCase()]).then(function(res) {
            //debugger;
            if(res.rows.length > 0) {
                var locators="";
                var i=0;
                for(i=0;i<res.rows.length;i++){
                    locators+=";" + res.rows.item(i).locators;
                }
                locators=locators.replace(";;",";");
                lePromise.resolve(locators);
            } else {
                console.log("No locators found");
                lePromise.resolve(null);
            }
        }, function (err) {
            console.log(err.message);
            lePromise.error(err);
        });
        return lePromise.promise;
    };
      
});