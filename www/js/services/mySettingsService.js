angular.module('amazona.services')
.service("MySettingsService", function($q, $cordovaSQLite) {
    var serviceSelf=this;
    serviceSelf.getChosenGarage=function() {
    var lePromise=$q.defer();
    lePromise.resolve(null);
    return lePromise.promise;
    };
   /*
   serviceSelf.getChosenGarage=function(key) {
       //alert("getChosenGarage");
       var lePromise=$q.defer();
       var query = "SELECT * FROM garage WHERE key=?";

       $cordovaSQLite.execute(db, query, [key]).then(function(res) {
           //debugger;
           //alert("getChosenGarage, after select");
           if(res.rows.length > 0) {
               var chosenGarage = {
                   id_garage : res.rows.item(0).id_garage,
                   chosen: res.rows.item(0).chosen,
                   id_language : res.rows.item(0).id_language,
                   name_responsible: res.rows.item(0).name_responsible,
                   garage_key: res.rows.item(0).key,
                   showAll: res.rows.item(0).showAll,
                   showAlternativeName: res.rows.item(0).showAlternativeName,
                   apply_equation: res.rows.item(0).apply_equation,
                   logo: res.rows.item(0).logo,
                   garage_name: res.rows.item(0).garage_name,
                   coat: res.rows.item(0).coat,
                   tel: res.rows.item(0).tel //'+961216764'
               }
               console.log("getChosenGarage" + ", SELECTED -> " + res.rows.item(0).id_garage + " " + res.rows.item(0).key);	
               lePromise.resolve(chosenGarage);
           } else {
               console.log("getChosenGarage, No results found");
               lePromise.resolve(undefined);
           }
       }, function (err) {
           console.log("getChosenGarage, after select err:" + err.message);
           console.log(err);
           lePromise.error(err);
       });

       
       return lePromise.promise;
   };
   */
   serviceSelf.saveShowAllHues=function(showAllHues) {
       var newValue="0";
       if(showAllHues){
           newValue="1";
       }
       var lePromise=$q.defer();
       var query = "UPDATE garage set showAll=? WHERE chosen='1'";
       var queryValues=[newValue];
       
       $cordovaSQLite.execute(db, query, queryValues).then(
           function(res) {
               lePromise.resolve();
           },
           function (err) {
               console.log(err);
               lePromise.error(err);
           }
       );
       return lePromise.promise;
   }
   
});