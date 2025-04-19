angular.module('amazona.services')
.service("createTablesService", function($q, $cordovaSQLite) {
    var serviceSelf=this;		
		
    serviceSelf.createGarages=function() {
        var lePromise=$q.defer();
        /*var query = "CREATE TABLE IF NOT EXISTS garage (" +
        "id_garage integer primary key, " +
        "chosen text, "+
        "id_language integer, " +
        "name_responsible text, "+
        "key text, "+
        "showAll text, "+
        "showAlternativeName text, "+
        "apply_equation text, "+
        "logo text, "+
        "garage_name text, "+
        "coat text, "+
        "tel text "+
        ")";*/
        
        var query="CREATE TABLE garage( 'id_garage' TEXT, 'id_language' TEXT, 'name_responsible' TEXT, 'chosen' TEXT, 'garage_name' TEXT, 'location' TEXT, 'logo' TEXT, 'apply_equation' TEXT, 'seqnum' TEXT, 'state' TEXT, 'Version' TEXT, 'coat' TEXT, 'showall' TEXT, 'showAlternativeName' TEXT, 'tel' TEXT, 'key' TEXT, 'public_tel' TEXT, 'theme_color' TEXT, 'key1' TEXT, 'username' TEXT )";
        
        //debugger;
        $cordovaSQLite.execute(db, query, []).then(
            function(res) {
                console.log("created garage");	
                lePromise.resolve();
            }, function (err) {
                console.log(err);
                lePromise.error(err);
            }
        );

        
        return lePromise.promise;
    };
    
    serviceSelf.createColorLocator=function() {
     var lePromise=$q.defer();
     var query = "CREATE TABLE IF NOT EXISTS colorLocator ( " +
     "id_colorLocator TEXT, " +
     "carname TEXT, " +
     "id_car TEXT, " +
     "carmodel TEXT," +
     "caryear TEXT, " +
     "locators TEXT )";
     
     //debugger;
        $cordovaSQLite.execute(db, query, []).then(function(res) {
           console.log("color locator");
           lePromise.resolve();
           }, function (err) {
            console.log(err);
            lePromise.error(err);
           });
        return lePromise.promise;
     };
     
     serviceSelf.createCars=function() {
        var lePromise=$q.defer();
        /*var query = "CREATE TABLE IF NOT EXISTS car (" +
        "id_car integer primary key," +
        "carImgPath text," +
        "model text," +
        "carName text," +
        "tableName text" +
        ")";*/
        var query = "CREATE TABLE car( 'id_car' TEXT, 'carImgPath' TEXT, 'model' TEXT, 'carName' TEXT, 'carYear' TEXT, 'seqnum' TEXT, 'state' TEXT, 'colorCodeLocation' TEXT, 'tableName' TEXT )";
        //debugger;
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            console.log("created car");	
            lePromise.resolve();
        }, function (err) {
            console.log(err);
            lePromise.error(err);
        });
        return lePromise.promise;
    };
    
    serviceSelf.createFormula=function(tableName) {
        var lePromise=$q.defer();
        var query = "CREATE TABLE IF NOT EXISTS " + tableName + "( 'id_formula' TEXT, 'id_formulaX' TEXT, 'id_formulaY' TEXT, 'formulaImgPath' TEXT, 'otherPrice' TEXT, 'id_otherCurreny' TEXT, 'id_otherUnit' TEXT, 'type' TEXT, 'id_car' TEXT, 'version' TEXT, 'name_formula' TEXT, 'c_year' TEXT, 'variant' TEXT, 'duplicate' TEXT, 'colorCode' TEXT, 'colorRGB' TEXT, 'clientName' TEXT, 'cardNumber' TEXT, 'seqnum' TEXT, 'state' TEXT, 'id_formulaZ' TEXT, 'id_formulaZp' TEXT, 'id_formulaZ2p' TEXT, 'id_formulaXp' TEXT, 'id_formulaX2p' TEXT, 'id_formulaYp' TEXT, 'id_formulaY2p' TEXT, 'isEquation15perc4201' TEXT, 'converted' TEXT, 'Date_cre_mod' TEXT, 'noEquation4201_180' TEXT, 'colorRGBPerc' TEXT, 'code_formulaX' TEXT, 'code_formulaXp' TEXT, 'code_formulaXpp' TEXT, 'code_formulaY' TEXT, 'code_formulaYp' TEXT, 'code_formulaYpp' TEXT, 'code_formulaZ' TEXT, 'code_formulaZp' TEXT, 'code_formulaZpp' TEXT )";
        //debugger;
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            console.log("created formula table " + tableName);	
            lePromise.resolve();
        }, function (err) {
            console.log(err);
            lePromise.error(err);
        });
        return lePromise.promise;
    };
    
    serviceSelf.createBasicColor=function() {
        var lePromise=$q.defer();
        /*var query = "CREATE TABLE IF NOT EXISTS color (" +
            "id_color integer primary key," +
            "colorImgPath text," + 
            "defaultPrice text," + 
            "id_defaultCurreny integer," + 
            "id_defaultUnit integer," + 
            "colorCode text," + 
            "name_color text," + 
            "masse_volumique text," + 
            "id_unit_on_entry integer," + 
            "name_color_alternative text," + 
            "masse_volumique_ext text"+
        ")";*/
        var query ="CREATE TABLE color( 'id_color' TEXT, 'colorImgPath' TEXT, 'defaultPrice' TEXT, 'id_defaultCurreny' TEXT, 'id_defaultUnit' TEXT, 'colorCode' TEXT, 'name_color' TEXT, 'masse_volumique' TEXT, 'state' TEXT, 'seqnum' TEXT, 'id_unit_on_entry' TEXT, 'name_color_alternative' TEXT, 'masse_volumique_ext' TEXT, 'argb' TEXT, 'name_color_alternative2' TEXT )";
        //debugger;
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            console.log("created Basic color ");	
            lePromise.resolve();
        }, function (err) {
            console.log(err);
            lePromise.error(err);
        });
        return lePromise.promise;
    };
    
    serviceSelf.createFormulaColor=function(tableName) {
        var lePromise=$q.defer();
        /*var query = "CREATE TABLE IF NOT EXISTS "+tableName+" (" +
                "id_formulaColor integer primary key," +
                "id_formula integer," +
                "id_color integer," +
                "quantite text," +
                "id_unit integer" +
            ")";*/
        var query = "CREATE TABLE IF NOT EXISTS " + tableName+ "( 'id_formulaColor' TEXT, 'id_formula' TEXT, 'id_color' TEXT, 'quantite' TEXT, 'id_unit' TEXT, 'state' TEXT, 'encrypted' TEXT )";
        //debugger;
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            console.log("created formulaColor table " + tableName);	
            lePromise.resolve();
        }, function (err) {
            console.log(err);
            lePromise.error(err);
        });
        return lePromise.promise;
    };  
});