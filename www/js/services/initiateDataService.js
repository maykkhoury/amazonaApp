angular.module('amazona.services')
.service("initiateDataService", function($q, $cordovaSQLite) {
    var serviceSelf=this;		
		
    serviceSelf.insertGarage=function() {
        console.log("insertGarage");
        //alert("garage insertGarage");
        var lePromise=$q.defer();
        var query = "INSERT INTO garage (id_garage,id_language,name_responsible,chosen,garage_name,location,logo,apply_equation,seqnum,state,Version,coat,showall,showAlternativeName,tel,key,public_tel,theme_color,key1,username) " +
        "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        $cordovaSQLite.execute(db, query, 
["1","1","name_responsible","0","garage_name","location","logo","1+false","1","1","1","LS","1","0","tel","123","09233159","0","key1","Laser"]
        ).then(function(res) {
            //debugger;
            if(res.rowsAffected> 0) {
                console.log("garage inserted nbr. -> " + res.rowsAffected);	
                //alert("garage inserted nbr. -> " + res.rowsAffected);	
                lePromise.resolve();
            } else {
                console.log("No garage inserted");
                lePromise.resolve();
            }
        }, function (err) {
            //alert("garage error:" + err.message);
            console.log(err);
            lePromise.error(err);
        });

        //alert("garage return promise insertGarage");
        return lePromise.promise;
    };
    
    serviceSelf.insertColorLocator=function() {
     //alert("garage insertGarage");
     var lePromise=$q.defer();
     var query = "INSERT INTO colorLocator (id_colorLocator,carname,id_car,carmodel,caryear,locators) " +
     "VALUES (?,?,?,?,?,?)";
     $cordovaSQLite.execute(db, query,
        ["1","Alfa Romeo","1", "all", "all",
         ";275px,175px;-35px,-25px;65px,130px;110px,170px;60px,285px;350px,135px;315px,135px;295px,130px;105px,130px;" +
         "115px,30px;25px,65px;294px,85px;150px,105px;95px,100px;255px,85px;335px,50px;145px,55px"
         ]).then(function(res) {
            //debugger;
            if(res.rowsAffected> 0) {
                console.log("colorlocators inserted nbr. -> " + res.rowsAffected);
                //alert("garage inserted nbr. -> " + res.rowsAffected);
                lePromise.resolve();
                } else {
                 console.log("No locators inserted");
                 lePromise.resolve();
                }
              }, function (err) {
                console.log(err);
                lePromise.error(err);
              });
     return lePromise.promise;
     };
     
     
     
     serviceSelf.insertCarsHelp = function(query,queryValues){
        var lePromise=$q.defer();
        
        $cordovaSQLite.execute(db, query, queryValues).then(function(res) {
                //debugger;
                if(res.rowsAffected> 0) {
                    console.log("car inserted nbr. -> " + res.rowsAffected);
                    lePromise.resolve();
                } else {
                    console.log("No cars inserted");
                    console.log("No cars inserted");
                    lePromise.resolve();
                }
            }, function (err) {
                console.log("insertCarsHelp - err:" + err.message);
                console.log(err);
                lePromise.error(err);
            });
        
        return lePromise.promise;
    };
    serviceSelf.insertCars=function() {
        console.log("insertCars");
        var lePromiseInit=$q.defer();
        var query = "INSERT INTO car (id_car,carImgPath,model,carName,tableName) " +
        "VALUES (?,?,?,?,?)";
        var queryValues=[
            "1",
            "Alfa Romeo.jpg",
            "1985",
            "Alfa Romeo",
            "Alfa_Romeo"
        ];
        serviceSelf.insertCarsHelp(query,queryValues).then(
            function(){
                var lePromise=$q.defer();
                var query = "INSERT INTO car (id_car,carImgPath,model,carName,tableName) " +
                "VALUES (?,?,?,?,?)";
                var queryValues=[
                    "2",
                    "Aston Martin.jpg",
                    "1985",
                    "Aston Martin",
                    "Aston_Martin"
                ]
                serviceSelf.insertCarsHelp(query,queryValues).then(
                    function(){
                        lePromiseInit.resolve();
                    }
                );
                lePromise.resolve();
            }
        );
        return lePromiseInit.promise;
    };
    serviceSelf.insertFormulasHelp = function(query,queryValues){
        var lePromise=$q.defer();
        
        $cordovaSQLite.execute(db, query, queryValues).then(function(res) {
                //debugger;
                if(res.rowsAffected> 0) {
                    console.log("formula inserted nbr. -> " + res.rowsAffected);
                    lePromise.resolve();
                } else {
                    console.log("No formula inserted");
                    lePromise.resolve();
                }
            }, function (err) {
                console.log(err);
                lePromise.error(err);
            });
        
        return lePromise.promise;
    };		
    serviceSelf.insertFormulas=function() {
        var lePromiseInit=$q.defer();
        var query = "INSERT INTO Alfa_Romeo ("+
            "id_formula," +
            "id_formulaX," +
            "id_formulaY," +
            "type," +
            "id_car," +
            "version," +
            "name_formula," +
            "c_year," +
            "variant," +
            "colorCode," +
            "colorRGB," +
            "clientName," +
            "cardNumber," +
            "id_formulaZ," +
            "id_formulaZp," +
            "id_formulaZ2p," +
            "id_formulaXp," +
            "id_formulaX2p," +
            "id_formulaYp," +
            "id_formulaY2p," +
            "isEquation15perc4201," +
            "converted," +
            "Date_cre_mod) " +
            "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        var queryValues=[
            '20831',
            '-1',
            '-1',
            'BC',
            '1',
            'S3',
            'BLU LIGHTING MET',
            '2001 - 2006',
            'R+D',
            '427B',
            '-2830136',
            '',
            'An exemple card number',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '1',
            '20:10:2016:13:26:18'
        ];
        serviceSelf.insertFormulasHelp(query,queryValues).then(
            function(){
                var lePromise=$q.defer();
                var query = "INSERT INTO Aston_Martin ("+
                "id_formula," +
                "id_formulaX," +
                "id_formulaY," +
                "type," +
                "id_car," +
                "version," +
                "name_formula," +
                "c_year," +
                "variant," +
                "colorCode," +
                "colorRGB," +
                "clientName," +
                "cardNumber," +
                "id_formulaZ," +
                "id_formulaZp," +
                "id_formulaZ2p," +
                "id_formulaXp," +
                "id_formulaX2p," +
                "id_formulaYp," +
                "id_formulaY2p," +
                "isEquation15perc4201," +
                "converted," +
                "Date_cre_mod) " +
                "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                var queryValues=[
                    '20832',
                    '-1',
                    '-1',
                    'LS',
                    '2',
                    'S6',
                    'ARRAN WHITE',
                    '2013 - 2016',
                    'DRT+Y',
                    '0053',
                    '-986896',
                    '',
                    'An exemple card number',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '1',
                    '20:10:2016:13:26:18'
                ]
                serviceSelf.insertFormulasHelp(query,queryValues).then(
                    function(){
                        lePromiseInit.resolve();
                    }
                );
                lePromise.resolve();
            }
        );
        return lePromiseInit.promise;
    };
    serviceSelf.insertColorsHelp = function(query,queryValues){
        var lePromise=$q.defer();
        
        $cordovaSQLite.execute(db, query, queryValues).then(function(res) {
                //debugger;
                if(res.rowsAffected> 0) {
                    console.log("color inserted nbr. -> " + res.rowsAffected);
                    lePromise.resolve();
                } else {
                    console.log("No color inserted");
                    lePromise.resolve();
                }
            }, function (err) {
                console.log(err);
                lePromise.error(err);
            });
        
        return lePromise.promise;
    };		
    serviceSelf.insertColors=function() {
        var lePromiseInit=$q.defer();
        var query = "INSERT INTO color ("+
            "id_color," + 
            "colorImgPath," + 
            "defaultPrice," + 
            "id_defaultCurreny," + 
            "id_defaultUnit," + 
            "colorCode," + 
            "name_color," + 
            "masse_volumique," + 
            "id_unit_on_entry," + 
            "name_color_alternative," + 
            "masse_volumique_ext) " +
            "VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        var queryValues=['10','114605.jpg','0','2','1','4002','BC 4002  Diluant','0.923','3','','0.923'];
        serviceSelf.insertColorsHelp(query,queryValues).then(
            function(){
                var lePromise=$q.defer();
                var query =  "INSERT INTO color ("+
                    "id_color," + 
                    "colorImgPath," + 
                    "defaultPrice," + 
                    "id_defaultCurreny," + 
                    "id_defaultUnit," + 
                    "colorCode," + 
                    "name_color," + 
                    "masse_volumique," + 
                    "id_unit_on_entry," + 
                    "name_color_alternative," + 
                    "masse_volumique_ext) " +
                    "VALUES (?,?,?,?,?,?,?,?,?,?,?)";
                var queryValues=['11','114940.jpg','0','2','1','4051','BC 4051  Light Green','0.987','5','','0.982'];
                serviceSelf.insertFormulasHelp(query,queryValues).then(
                    function(){
                        lePromiseInit.resolve();
                    }
                );
                lePromise.resolve();
            }
        );
        return lePromiseInit.promise;
    };	

    serviceSelf.insertFormulaColorsHelp = function(query,queryValues){
        
        var lePromise=$q.defer();
        
        $cordovaSQLite.execute(db, query, queryValues).then(function(res) {
                //debugger;
                if(res.rowsAffected> 0) {
                    console.log("formula color inserted nbr. -> " + res.rowsAffected);
                    lePromise.resolve();
                } else {
                    console.log("No formula color inserted");
                    lePromise.resolve();
                }
            }, function (err) {
                console.log(err);
                lePromise.error(err);
            });
        
        return lePromise.promise;
    };

    serviceSelf.insertFormulaColors=function() {
        var lePromiseInit=$q.defer();
        var query = "INSERT INTO Alfa_Romeo_formulaColor ("+
                "id_formulaColor," +
                "id_formula," +
                "id_color," +
                "quantite," +
                "id_unit " +
            ") " +
            "VALUES (?,?,?,?,?)";
        var queryValues=['23','20831','10','6.4','2'];
        serviceSelf.insertFormulasHelp(query,queryValues).then(
            function(){
                var lePromise=$q.defer();
                var query = "INSERT INTO Alfa_Romeo_formulaColor ("+
                    "id_formulaColor," +
                    "id_formula," +
                    "id_color," +
                    "quantite," +
                    "id_unit " +
                ") " +
                "VALUES (?,?,?,?,?)";
                var queryValues=['24','20831','11','46.89','2'];
                serviceSelf.insertFormulasHelp(query,queryValues).then(
                    function(){
                        var lePromise=$q.defer();
                        var query = "INSERT INTO Aston_Martin_formulaColor ("+
                            "id_formulaColor," +
                            "id_formula," +
                            "id_color," +
                            "quantite," +
                            "id_unit " +
                        ") " +
                        "VALUES (?,?,?,?,?)";
                        var queryValues=['25','20832','10','116.18','2'];
                        serviceSelf.insertFormulasHelp(query,queryValues).then(
                            function(){
                                var lePromise=$q.defer();
                                var query = "INSERT INTO Aston_Martin_formulaColor ("+
                                    "id_formulaColor," +
                                    "id_formula," +
                                    "id_color," +
                                    "quantite," +
                                    "id_unit " +
                                ") " +
                                "VALUES (?,?,?,?,?)";
                                var queryValues=['26','20832','11','322.39','2'];
                                serviceSelf.insertFormulasHelp(query,queryValues).then(
                                    function(){
                                        lePromiseInit.resolve();
                                    }
                                );
                                lePromise.resolve();
                            }
                        );
                        lePromise.resolve();
                    }
                );
                lePromise.resolve();
            }
        );
        return lePromiseInit.promise;
    };
});