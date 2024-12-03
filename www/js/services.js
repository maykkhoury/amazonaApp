angular.module('amazona.services', [])
.service("initiateDataService", function($q,$cordovaSQLite) {
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
})
.service("createTablesService", function($q,$cordovaSQLite) {
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
		
})
.service("getAllCarsService", function($q,$cordovaSQLite) {
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
		
		
})
.service("MyLoginService", function($q,$cordovaSQLite) {
		var serviceSelf=this;	
		//alert("in MyLoginService");
		serviceSelf.formatThemeColor = function (color) {
			//case color=#122321
			if(color.indexOf('#')===0){
				return color;
			}
			
			//case color=green
			if(!Number(color)){
				return color;
			}
			
			//case color=-12356
			var retVal = "";
			try{
				retVal = '#'+ ('000000' + (color & 0xFFFFFF).toString(16)).slice(-6);
			}catch(err){
				retVal=color;
				console.log(err.message);
			}
			
			return retVal;
		};
		
		
		serviceSelf.getChosenGarage=function() {
			console.log("getChosenGarage Service");
			//alert("getChosenGarage function");
			var lePromise=$q.defer();
			var query = "SELECT * FROM garage WHERE chosen = '1'";
			console.log("getChosenGarage db="+db);
			$cordovaSQLite.execute(db, query).then(function(res) {
				if(res.rows.length > 0) {
					console.log("getChosenGarage found 1");
					//alert("getChosenGarage  found 1");
					var selectedKey=res.rows.item(0).key;
					var selectedName=res.rows.item(0).username;
					console.log("getChosenGarage key ="+selectedKey);
					//alert("getChosenGarage key ="+selectedKey);
					serviceSelf.doLogin(selectedKey,selectedName).then(
						function(res) {
							lePromise.resolve(res);
						}
					);
				}else{
					console.log("getChosenGarage Service No results found");
					//alert("getChosenGarage Service No results found");
					lePromise.resolve(null);
				}
			}, function (err) {
				console.log("doLogin Service" + err.message);
				console.log(err);
				//alert("doLogin Service" + err.message);
				//alert(err);
				lePromise.error(err);
			});

			return lePromise.promise;
		}
		
		serviceSelf.setChosenGarage=function(enteredKey) {
			console.log("setChosenGarage Service");
			var lePromise=$q.defer();
			var query = "update garage set chosen = '1' where key=?";
			console.log("setChosenGarage db="+db);
			$cordovaSQLite.execute(db, query,[enteredKey]).then(function(res) {
				lePromise.resolve(null);
			}, function (err) {
				console.log("setChosenGarage Service" + err.message);
				console.log(err);
				lePromise.error(err);
			});

			return lePromise.promise;
		}
		serviceSelf.cancelChosenGarage=function() {
			console.log("cancelChosenGarage Service");
			var lePromise=$q.defer();
			var query = "update garage set chosen = '0'";
			console.log("cancelChosenGarage db="+db);
			$cordovaSQLite.execute(db, query).then(function(res) {
				lePromise.resolve(null);
			}, function (err) {
				console.log("cancelChosenGarage Service" + err.message);
				console.log(err);
				lePromise.error(err);
			});

			return lePromise.promise;
		}
		
		serviceSelf.doLogin=function(enteredKey, enteredName) {
			//alert("doLogin function");
			var lePromise=$q.defer();
			var query = "SELECT * FROM garage WHERE key = ? and username= ?";
			//alert("doLogin afer promise defer");
			if($cordovaSQLite === null){
				//alert("doLogin cordovaSQLite is null");
			}else{
				if($cordovaSQLite === undefined){
					//alert("doLogin cordovaSQLite is undefined");
				}else{
					//alert("doLogin cordovaSQLite is neither null neither undefined");
				}
			}
			try {
				$cordovaSQLite.execute(db, query, [enteredKey,enteredName]).then(function(res) {
					//alert("doLogin inside execute");
					if(res.rows.length > 0) {
						//alert("doLogin inside res.rows.length > 0");
						var themeColorDB=res.rows.item(0).theme_color;
						var themeColorChosen = "";
						if(themeColorDB!== undefined && themeColorDB !== null && themeColorDB !==""){
							themeColorChosen= serviceSelf.formatThemeColor(themeColorDB);
						}else{
							themeColorChosen="red";
						}
						
						var appEqDeb=res.rows.item(0).apply_equation;
						var appEq5=false;
						var appEq6=false;
						var appEq='0';
						if(appEqDeb.indexOf('+') === -1){
							appEq=appEqDeb;
						}else{
							appEq = appEqDeb.substring(0, appEqDeb.indexOf("+"));
							
							console.log('appEq='+appEq);
							
							if(appEqDeb.substring(appEqDeb.indexOf("+") + 1).indexOf("eq6")!==-1){
								var temp = appEqDeb.substring(appEqDeb.indexOf("+") + 1);
								appEq5 = ((temp.substring(0,temp.indexOf("eq6"))) === true);
								appEq6 = ((temp.substring(temp.indexOf("eq6") + 3)) === true);
							}else{
								appEq5 = ((appEqDeb.substring(appEqDeb.indexOf("+") + 1)) === true);
							}
							
							console.log('appEq5='+appEq5);
						}
						var chosenGarage = {
							id_garage : res.rows.item(0).id_garage,
							chosen: res.rows.item(0).chosen,
							id_language : res.rows.item(0).id_language,
							name_responsible: res.rows.item(0).name_responsible,
							garage_key: res.rows.item(0).key,
							showAll: res.rows.item(0).showAll,
							showAlternativeName: res.rows.item(0).showAlternativeName,
							apply_equation: appEq,
							apply_equation5: appEq5,
							apply_equation6: appEq6,
							logo: res.rows.item(0).logo,
							garage_name: res.rows.item(0).garage_name,
							coat: res.rows.item(0).coat,
							tel: res.rows.item(0).tel, //'+961216764'
							theme_color: themeColorChosen
						}
						

						console.log("doLogin Service tel="+chosenGarage.tel + " - name="+chosenGarage.garage_name);
						console.log("doLogin Service SELECTED -> " + res.rows.item(0).id_garage + " " + res.rows.item(0).key);	
						//alert("doLogin Service tel="+chosenGarage.tel + " - name="+chosenGarage.garage_name);
						//alert("doLogin Service SELECTED -> " + res.rows.item(0).id_garage + " " + res.rows.item(0).key);	
						lePromise.resolve(chosenGarage);
					} else {
						console.log("doLogin Service No results found");
						//alert("doLogin Service No results found");
						lePromise.resolve(null);
					}
				}, function (err) {
					console.log("doLogin Service" + err.message);
					console.log(err);
					//alert("doLogin Service" + err.message);
					//alert(err);
					lePromise.error(err);
				});
			} catch ({ name, message }) {
				alert("in catch error and error type is : " + name + " , error message is: " + message);
			}

			
			return lePromise.promise;
		};
		
})
.service("MySettingsService", function($q,$cordovaSQLite) {
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
		
})
.service("MySyncService", function($q,$cordovaSQLite) {
		var serviceSelf=this;

		serviceSelf.getVersionIndexToUse = function(updatesObj, currentLastUpdateVersion){
			var versionIndexToUse = -1;
			var numberOfUpdate = updatesObj.length;
			for(var i=0;i<numberOfUpdate; i++){
				var versionToTest = updatesObj[i].version;
				if(currentLastUpdateVersion<versionToTest){
					versionIndexToUse=i;
					break;
				}
			}
			return versionIndexToUse;
		}
	
		serviceSelf.getGarageById=function(id_garage) {
			console.log("getChosenGarage Service");
			var lePromise=$q.defer();
			var query = "SELECT * FROM garage WHERE id_garage = ?";
			var queryValues=[id_garage];
			$cordovaSQLite.execute(db, query,queryValues).then(function(res) {
				if(res.rows.length > 0) {
					console.log("garage id=" + id_garage + "found");
					var theGarage = res.rows.item(0)
					
					lePromise.resolve(theGarage);
				}else{
					console.log("getGarageById Service No results found fo id=" + id_garage);
					lePromise.resolve(null);
				}
			}, function (err) {
				console.log("getGarageById Service" + err.message);
				console.log(err);
				lePromise.error(err);
			});

			return lePromise.promise;
		}
		serviceSelf.getStopSyncIndex=function() {
			var lePromise=$q.defer();
			var query = "SELECT stopSyncIndex FROM appSync";
			$cordovaSQLite.execute(db, query).then(function(res) {
				lePromise.resolve(res.rows.item(0).stopSyncIndex);
			}, function (err) {
				lePromise.resolve(-1);
			});
			return lePromise.promise;
		};
		serviceSelf.getCurrentVersionFromDB=function() {
			var lePromise=$q.defer();
			var query = "SELECT theVersion FROM appSync";
			$cordovaSQLite.execute(db, query).then(function(res) {
				lePromise.resolve(res.rows.item(0).theVersion);
			}, function (err) {
				//create the table and insert row with the version
				serviceSelf.createAppSyncTable().then(
					function(val){
						serviceSelf.insertVersionRow(0).then(
							function(val){
								lePromise.resolve(0);
							}
						)
					}
				)
			});
			return lePromise.promise;
		};
		serviceSelf.getObjectValues = function(obj){
			const objKeys = Object.keys(obj);
			var t=0;
			var objValuesArr = [];
			for(t=0;t<objKeys.length;t++){
				objValuesArr.push(obj[objKeys[t]]);
			}
			return objValuesArr;
		};
		
		serviceSelf.createAppSyncTable=function() {
			var lePromise=$q.defer();
			var query = "CREATE TABLE IF NOT EXISTS appSync (" +
			"theVersion integer, stopSyncIndex integer" +
			")";
			//debugger;
			$cordovaSQLite.execute(db, query, []).then(
				function(res) {
					console.log("created appSync");	
					lePromise.resolve();
				}, function (err) {
					console.log(err);
					lePromise.error(err);
				}
			);
			return lePromise.promise;
		};
		
		serviceSelf.insertVersionRow=function(theVersion) {
			var lePromise=$q.defer();
			var query = "insert into appSync(theVersion) values(?)";
			var queryValues=[theVersion];
			
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
		};
		
		serviceSelf.setForceSync=function(force) {
			var lePromise=$q.defer();
			var query = "update appSync set forceSync=?";
			var queryValues=[force];
			
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
		};
		
		serviceSelf.getForceSync=function() {
			var lePromise=$q.defer();
			var query = "SELECT forceSync FROM appSync";
			$cordovaSQLite.execute(db, query).then(function(res) {
				lePromise.resolve(res.rows.item(0).forceSync);
			}, function (err) {
				lePromise.resolve(false);
			});
			return lePromise.promise;
		};
		
		
		serviceSelf.updateVersionRow=function(theVersion) {
			var lePromise=$q.defer();
			var query = "update appSync set theVersion=?";
			var queryValues=[theVersion];
			
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
		};

		serviceSelf.loopThroughVersions=function(updatesObj,versionIndexToUse) {
			var jsObj = updatesObj.updates;
			var lePromise=$q.defer();
			//debugger;
			//loop through versions
			var chain = $q.when();
			var wrapFunction = function(updateContentObj, theVersion){
				
				 return $q(function(resolve, reject) {
					chain = chain.then(function() {
						console.log("doing garages of version:" + theVersion);
						return 	serviceSelf.loopThroughGarages(updateContentObj);
					}).then(function(){
						console.log("doing colors of version:" + theVersion);
						return 	serviceSelf.loopThroughColors(updateContentObj);	
					}).then(function(){
						console.log("doing cars of version:" + theVersion);
						return 	serviceSelf.loopThroughCars(updateContentObj);	
					}).then(function(){
						console.log("doing formulas of version:" + theVersion);
						return 	serviceSelf.loopThroughFormulas(updateContentObj);	
					});
				  });
			
			};
			for(var i = versionIndexToUse; jsObj !== null && i<jsObj.length; i++) {
				
				var updateContentObj = jsObj[i].updateContent;
				var theVersion = jsObj[i].version;
				
				console.log("-------------------------------------------");
				console.log("update version:" + theVersion);
				wrapFunction(updateContentObj,theVersion).then(function(){
					chain.resolve();
				});
				
			}
			
			return chain;
		};
			
		serviceSelf.loopThroughGarages=function(updateContentObj) {
			var jsObj = updateContentObj.garages;
			var lePromise=$q.defer();
			//debugger;
			//loop through garages
			var chain = $q.when();
			var wrapFunction = function(currentObj){
				return $q(function(resolve, reject) {
					chain = chain.then(function() {
						console.log("garage " + currentObj.garage_name + " sent to sync function");
						return serviceSelf.syncGarage(currentObj);
					});
				});
			}
			for(var i = 0; jsObj != null && i<jsObj.length; i++) {
				var currentObj = jsObj[i];
				console.log("garage " + currentObj.garage_name + " added to chain");
				wrapFunction(currentObj).then(function(){
					chain.resolve();
				});
			}
			
			return chain;
		};
		
		serviceSelf.loopThroughColors=function(updateContentObj) {
			var jsObj = updateContentObj.colors;
			var lePromise=$q.defer();
			//debugger;
			//loop through colors
			var chain = $q.when();
			var wrapFunction = function(currentObj){
				return $q(function(resolve, reject) {
					chain = chain.then(function() {
						console.log("color " + currentObj.colorCode + " sent to sync function");
						return serviceSelf.syncColor(currentObj);
					});
				});
			}
			
			for(var i = 0; jsObj != null && i<jsObj.length; i++) {
				var currentObj = jsObj[i];
				console.log("color " + currentObj.colorCode + " added to chain");
				wrapFunction(currentObj).then(function(){
					chain.resolve();
				});
			}
			
			return chain;
		};
		
		serviceSelf.loopThroughCars=function(updateContentObj) {
			var jsObj = updateContentObj.cars;
			var lePromise=$q.defer();
			//debugger;
			//loop through cars
			var chain = $q.when();
			var wrapFunction = function(currentObj){
				return $q(function(resolve, reject) {
					chain = chain.then(function() {
						console.log("car " + currentObj.tableName + " sent to sync function");
						return serviceSelf.syncCar(currentObj);
					});
				});
			}
			
			for(var i = 0; jsObj != null && i<jsObj.length; i++) {
				var currentObj = jsObj[i];
				console.log("car " + currentObj.tableName + " added to chain");
				wrapFunction(currentObj).then(function(){
					chain.resolve();
				});
			}
			
			return chain;
		};
			
		serviceSelf.loopThroughFormulas=function(updateContentObj) {
			var jsObj = updateContentObj.formulas;
			var lePromise=$q.defer();
			//debugger;
			//loop through formulas
			var chain = $q.when();
			var wrapFunction = function(currentObj,currentFormulaTable,currentFormulaColorArray,actionType){
				return $q(function(resolve, reject) {
					chain = chain.then(function() {
						console.log("formula " + currentObj.colorCode + " sent to sync function");
						return serviceSelf.syncFormula(currentObj,currentFormulaTable,actionType);
					}).then(function() {
						console.log("formula color" + currentObj.colorCode + " sent to loop function");
						if(currentFormulaColorArray!=null && currentFormulaColorArray.length>0){
							return serviceSelf.loopThroughFormulaColors(currentFormulaColorArray,currentFormulaTable,actionType,currentObj.id_formula);
						}
					});
				});
			}
			
			for(var i = 0; jsObj != null && i<jsObj.length; i++) {
				var currentObj = jsObj[i];
				
				
				var currentFormulaTable = currentObj.tableName;
				delete currentObj.tableName;
				
				var currentFormulaColorArray = currentObj.formulaColor;
				delete currentObj.formulaColor;
				
				var actionType=currentObj.actionType;
				delete currentObj.actionType;
		
				console.log("formula " + currentObj.colorCode + " of " + currentFormulaTable + " added to chain with actionType=" + actionType);
				wrapFunction(currentObj,currentFormulaTable,currentFormulaColorArray,actionType).then(function(){
					chain.resolve();
				});
				
			}
			
			return chain;
		};
		
		serviceSelf.loopThroughFormulaColors=function(formulaColorArray,formulaTable,actionType,id_formula) {
			var jsObj = formulaColorArray;
			var lePromise=$q.defer();
			//debugger;
			if(actionType === "delete"){ //just delete without looping
				serviceSelf.deleteFormulaColors(id_formula, formulaTable).then(function(){
					lePromise.resolve();
				});
				return lePromise.promise;
			}else{
				//loop through formulaColors.
				var chain = $q.when();
				if(jsObj != null && jsObj.length>0){
					//delete formulaColors first
					serviceSelf.deleteFormulaColors(id_formula, formulaTable).then(function(){
						var wrapFunction = function(currentObj){
							return $q(function(resolve, reject) {
								chain = chain.then(function() {
									console.log("formulaColor  " + currentObj.id_formulaColor + " sent to sync function");
									return serviceSelf.syncFormulaColor(currentObj, formulaTable, actionType);
								});
							});
						}
							
						for(var i = 0; jsObj != null && i<jsObj.length; i++) {
							var currentObj = jsObj[i];
							console.log("formulaColor " + currentObj.id_formulaColor + " added to chain");
							wrapFunction(currentObj).then(function(){
								chain.resolve();
							});
						}
						
					});
				}else{
					//should not be here
				}
				
				return chain;
			}
		};
		
		serviceSelf.getTableId=function(tableName) {
			//alert("getCars")
			var lePromise=$q.defer();
			var query = "SELECT max(id_" + tableName + ") as maxId from " + tableName;
			//debugger;
			$cordovaSQLite.execute(db, query, []).then(function(res) {
				//debugger;
				if(res.rows.length > 0) {
					var maxId=res.rows.item(0).maxId;	
					if(maxId === null){
						lePromise.resolve(0);
					}else{
						lePromise.resolve(Number(maxId));
					}
					
				} else {
					lePromise.resolve(0);
				}
			}, function (err) {
				console.log(err.message);
				lePromise.error(err);
			});

			
			return lePromise.promise;
		};
		
		serviceSelf.syncGarage=function(garageObj) {
			var lePromise=$q.defer();
			//
			var actionType=garageObj.actionType;
			delete garageObj.actionType;
			//first delete this obj, then reinsert it later if the action is "add" or "edit"
			var query = "delete from garage where id_garage=?";
			var deleteValues = [garageObj.id_garage];
			//get the old logo first and reinsert it
			serviceSelf.getGarageById(garageObj.id_garage).then(function(res){
				if(res != null){
					var oldLogo = res.logo;
					garageObj.logo = oldLogo;
				}
				
				$cordovaSQLite.execute(db, query, deleteValues).then(function(res) {
			
					console.log("garage deleted name -> " + garageObj.garage_name);	
					
					//resinsert the garage
					if(actionType !== "delete"){
						//get id_garage
						//serviceSelf.getTableId("garage").then(function(maxId){
							//debugger;
							/*var incMaxId = maxId + 1;
							garageObj["id_garage"] = "" + incMaxId;*/
							var attrStr="";
							var attrAssign="";
							const objKeys = Object.keys(garageObj);

							for (var ind=0; ind<objKeys.length; ind++) {
								var objKey=objKeys[ind];
								attrStr += objKey;
								attrAssign += "?";
								if(ind < objKeys.length - 1){
									attrStr +=",";
									attrAssign +=",";
								}
							}
							const objValues= serviceSelf.getObjectValues(garageObj);
							var query = "INSERT INTO garage (" + attrStr + ") " +
							"VALUES (" + attrAssign + ")";
							console.log(query);
							console.dir(objValues);
							$cordovaSQLite.execute(db, query, objValues).then(function(res) {
								if(res.rowsAffected> 0) {
									console.log("garage inserted id. -> " + garageObj.id_garage + 
										", name -> " + garageObj.garage_name+ 
										", eq -> " + garageObj.apply_equation);		
									lePromise.resolve();
								} else {
									console.log("garage NOT inserted id. -> " + garageObj.id_garage + 
										", name -> " + garageObj.garage_name+ 
										", eq -> " + garageObj.apply_equation);		
									lePromise.resolve();
								}
							}, function (err) {
								console.log(err);
								lePromise.error(err);
							});
		
						/*},function(err){
							console.log(err);
							lePromise.error(err);
						});*/
					} else {
						lePromise.resolve();
					}
				}, function (err) {
					console.log(err);
					lePromise.error(err);
				});
			},function(err){
				console.log(err);
				lePromise.error(err);
			});
			
			return lePromise.promise;
		};
				
		serviceSelf.syncColor=function(colorObj) {
			var lePromise=$q.defer();
			//
			var actionType=colorObj.actionType;
			delete colorObj.actionType;
			//first delete this obj, then reinsert it later if the action is "add" or "edit"
			var query = "delete from color where id_color=?";
			var deleteValues = [colorObj.id_color];
			$cordovaSQLite.execute(db, query, deleteValues).then(function(res) {
			
				console.log("color deleted name -> " + colorObj.colorCode +
				", code ->" + colorObj.colorCode);	
				
				//resinsert the color
				if(actionType !== "delete"){
					//get id_color
					/*serviceSelf.getTableId("color").then(function(maxId){
						debugger;
						var incMaxId = maxId + 1;
						colorObj["id_color"] = "" + incMaxId;*/
						var attrStr="";
						var attrAssign="";
						const objKeys = Object.keys(colorObj);
						for (var ind=0; ind<objKeys.length; ind++) {
							var objKey=objKeys[ind];
							attrStr += objKey;
							attrAssign += "?";
							if(ind < objKeys.length - 1){
								attrStr +=",";
								attrAssign +=",";
							}
						}
						const objValues= serviceSelf.getObjectValues(colorObj);
						var query = "INSERT INTO color (" + attrStr + ") " +
						"VALUES (" + attrAssign + ")";
						$cordovaSQLite.execute(db, query, objValues).then(function(res) {
							if(res.rowsAffected> 0) {
								console.log("color inserted id. -> " + colorObj.id_color + 
									", name -> " + colorObj.name_color + 
									", code -> " + colorObj.colorCode);		
								lePromise.resolve();
							} else {
								console.log("color NOT inserted id. -> " + colorObj.id_color + 
									", name -> " + colorObj.name_color + 
									", code -> " + colorObj.colorCode);			
								lePromise.resolve();
							}
						}, function (err) {
							console.log(err);
							lePromise.error(err);
						});
	
					/*},function(err){
						console.log(err);
						lePromise.error(err);
					});*/
				} else {
					lePromise.resolve();
				}
			}, function (err) {
				console.log(err);
				lePromise.error(err);
			});
			return lePromise.promise;
		};
		
		serviceSelf.syncCar=function(carObj) {
			var lePromise=$q.defer();
			//
			var actionType=carObj.actionType;
			delete carObj.actionType;
			//first delete this obj, then reinsert it later if the action is "add" or "edit"
			var query = "delete from car where id_car=? ";
			var deleteValues = [carObj.id_car];
			$cordovaSQLite.execute(db, query, deleteValues).then(function(res) {
			
				console.log("car deleted name -> " + carObj.tableName);	
				
				//resinsert the color
				if(actionType !== "delete"){
					var attrStr="";
					var attrAssign="";
					const objKeys = Object.keys(carObj);
					for (var ind=0; ind<objKeys.length; ind++) {
						var objKey=objKeys[ind];
						attrStr += objKey;
						attrAssign += "?";
						if(ind < objKeys.length - 1){
							attrStr +=",";
							attrAssign +=",";
						}
					}
					const objValues= serviceSelf.getObjectValues(carObj);
					var query = "INSERT INTO car (" + attrStr + ") " +
					"VALUES (" + attrAssign + ")";
					$cordovaSQLite.execute(db, query, objValues).then(function(res) {
						if(res.rowsAffected> 0) {
							console.log("car inserted id. -> " + carObj.id_car+ 
								", name -> " + carObj.tableName);
						} else {
							console.log("car NOT inserted id. -> " + carObj.id_car+ 
								", name -> " + carObj.tableName);
						}
						//create the formula and formulaTable correspondent for this car if the don't exist
						serviceSelf.createFormula(carObj.tableName).then(
							function(){
								serviceSelf.createFormulaColor(carObj.tableName + "_formulaColor").then(
									function(){
										lePromise.resolve();
									}, function (err) {
									console.log(err);
									lePromise.error(err);
									});
							}, function (err) {
								console.log(err);
								lePromise.error(err);
							});
		
						
					}, function (err) {
						console.log(err);
						lePromise.error(err);
					});

				} else {
					lePromise.resolve();
				}
			}, function (err) {
				console.log(err);
				lePromise.error(err);
			});
			return lePromise.promise;
		};
		
		serviceSelf.syncFormula=function(formulaObj,formulaTable,actionType) {
			var lePromise=$q.defer();

			//first delete this obj, then reinsert it later if the action is "add" or "edit"

			var query = "delete from " + formulaTable + " where id_formula=? ";
			var deleteValues = [formulaObj.id_formula];
			$cordovaSQLite.execute(db, query, deleteValues).then(function(res) {
			
				console.log(formulaTable + " formula deleted code -> " + formulaObj.colorCode);	
				//resinsert the formula
				if(actionType !== "delete"){
					var attrStr="";
					var attrAssign="";
					const objKeys = Object.keys(formulaObj);
					for (var ind=0; ind<objKeys.length; ind++) {
						var objKey=objKeys[ind];
						attrStr += objKey;
						attrAssign += "?";
						if(ind < objKeys.length - 1){
							attrStr +=",";
							attrAssign +=",";
						}
					}
					const objValues= serviceSelf.getObjectValues(formulaObj);
					var query = "INSERT INTO " + formulaTable + " (" + attrStr + ") " +
					"VALUES (" + attrAssign + ")";
					$cordovaSQLite.execute(db, query, objValues).then(function(res) {
						if(res.rowsAffected> 0) {
							console.log("formula inserted id. -> " + formulaObj.id_formula+ 
								", code -> " + formulaObj.colorCode);
						} else {
							console.log("formula NOT inserted id. -> " + formulaObj.id_formula+ 
								", code -> " + formulaObj.colorCode);		
						}
						lePromise.resolve();
					}, function (err) {
						console.log(err);
						lePromise.error(err);
					});
				} else {
					lePromise.resolve();
				}
				
			}, function (err) {
				console.log(err);
				lePromise.error(err);
			});
			return lePromise.promise;
		};
		
		serviceSelf.syncFormulaColor=function(formulaColorObj,formulaTable,actionType) {
			var lePromise=$q.defer();
			//first delete this obj, then reinsert it later if the action is "add" or "edit"
			var query = "delete from " + formulaTable + "_formulaColor where id_formulaColor=? ";
			var deleteValues = [formulaColorObj.id_formulaColor];
			$cordovaSQLite.execute(db, query, deleteValues).then(function(res) {
			
				console.log("formulaColor deleted id -> " + formulaColorObj.id_formulaColor);	
				
				//resinsert the color
				if(actionType !== "delete"){
					
					var attrStr="";
					var attrAssign="";
					const objKeys = Object.keys(formulaColorObj);
					for (var ind=0; ind<objKeys.length; ind++) {
						var objKey=objKeys[ind];
						attrStr += objKey;
						attrAssign += "?";
						if(ind < objKeys.length - 1){
							attrStr +=",";
							attrAssign +=",";
						}
					}
					const objValues= serviceSelf.getObjectValues(formulaColorObj);
					var query = "INSERT INTO " + formulaTable + "_formulaColor (" + attrStr + ") " +
					"VALUES (" + attrAssign + ")";
					$cordovaSQLite.execute(db, query, objValues).then(function(res) {
						if(res.rowsAffected> 0) {
							console.log("formulaColor inserted id. -> " + formulaColorObj.id_formulaColor);		
							lePromise.resolve();
						} else {
							console.log("formulaColor NOT inserted id. -> " + formulaColorObj.id_formulaColor);		
							lePromise.resolve();
						}
					}, function (err) {
						console.log(err);
						lePromise.error(err);
					});

			
				} else {
					lePromise.resolve();
				}
			}, function (err) {
				console.log(err);
				lePromise.error(err);
			});
			return lePromise.promise;
		};
	
		serviceSelf.deleteFormulaColors=function(id_formula, formulaTable) {
			var lePromise=$q.defer();
			var query = "delete from " + formulaTable + "_formulaColor WHERE id_formula=?";
			var queryValues=[id_formula];
			
			$cordovaSQLite.execute(db, query, queryValues).then(
				function(res) {
					console.log(res.rowsAffected + " formulaColor row deleted for formula id =" + id_formula + " for table =" + formulaTable);
					lePromise.resolve();
				},
				function (err) {
					console.log(err);
					lePromise.error(err);
				}
			);
			return lePromise.promise;
		}
		
		serviceSelf.createFormulaColor=function(tableName) {
			var lePromise=$q.defer();
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
})
.service("SearchColorsService", function($q,$cordovaSQLite,MySettingsService,$rootScope) {
	var serviceSelf=this;
	serviceSelf.search=function(id_formula, tableName, typeFormula, isCouche, isApply4201_180Eq) {
		var lePromise=$q.defer();
		var query = "SELECT * FROM "+tableName+", color where "+tableName+".id_color=color.id_color and "+tableName+".id_formula=? ";
		var queryValues=[id_formula];
		$cordovaSQLite.execute(db, query, queryValues).then(
			function(res) { //succes
				//debugger;
				if(res.rows.length > 0) {
					var basicColors=[];
					var i=0;
					for(i=0;i<res.rows.length;i++){
						basicColors[i]=res.rows.item(i);
						if($rootScope.chosenGarage.apply_equation ==="2"){
							if(basicColors[i].masse_volumique_ext >0){
								basicColors[i].masse_volumique = basicColors[i].masse_volumique_ext;
							}
						}
						if($rootScope.chosenGarage.showAlternativeName ==="1"){
							if(basicColors[i].name_color_alternative !=="" && basicColors[i].name_color_alternative !== undefined){
								basicColors[i].name_color = basicColors[i].name_color_alternative;
							}
						}
						if($rootScope.chosenGarage.showAlternativeName ==="2"){
							if(basicColors[i].name_color_alternative2 !=="" && basicColors[i].name_color_alternative2 !== undefined){
								basicColors[i].name_color = basicColors[i].name_color_alternative2;
							}
						}
						//make sure the quantite is numeric
						basicColors[i].quantite = Number(basicColors[i].quantite);
						//---------------
						console.log("SELECTED basic color-> " + res.rows.item(i).quantite);
					}
					basicColors=serviceSelf.applyEquation(basicColors, typeFormula, $rootScope.chosenGarage.apply_equation,isCouche,$rootScope.chosenGarage.apply_equation5,$rootScope.chosenGarage.apply_equation6,isApply4201_180Eq);
					basicColors=serviceSelf.setToKiloConverter(basicColors);
					lePromise.resolve(basicColors);
				} else {
					console.log("No colors found");
					lePromise.resolve(null);
				}
			}, 
			//error
			function (err) {
				console.log(err);
				lePromise.error(err);
			}
		);
		return lePromise.promise;	
	};
	
	serviceSelf.setToKiloConverter = function(basicColors){
		var totalQty = 0;
		var i = 0;
        for(i = 0; i<basicColors.length; i++){
			totalQty += basicColors[i].quantite;
		}
		
		for(i = 0; i<basicColors.length; i++){
			basicColors[i].toKiloConverter = 1000/totalQty;
		}
		
		return basicColors;
	};
	serviceSelf.applyEquation = function(basicColors,typeFormula, equationNumber, isCouche, appEq5, appEq6, isApply4201_180Eq){
		console.log("applyEquation=typeFormula="+typeFormula);
		console.log("applyEquation=equationNumber="+equationNumber);
		
		 var qty4201 = serviceSelf.findQuantityOfColorInformula(basicColors, "4201");
		  
		if (typeFormula === "LS"){
			console.log("applyEquation=sortDescending");
			basicColors = serviceSelf.sortDescending(basicColors);//OK Tested
		}else{
			if (typeFormula === "BC"){
				console.log("applyEquation=applyEquationBC");
				basicColors = serviceSelf.applyEquationBC(basicColors, "4002", "4110");//OK Tested
			}
			if (Number(equationNumber) === 1){
				console.log("applyEquation=eqDoubleCBXB_50per4010,equationNumber=1");
				basicColors = serviceSelf.eqDoubleCBXB_50per4010(basicColors);//OK Tested
			}else{
				if (Number(equationNumber) === 2 || Number(equationNumber) === 4){
					console.log("applyEquation=eqDoubleCBXB_50per4010Extended,equationNumber=2,4");
					basicColors = serviceSelf.eqDoubleCBXB_50per4010Extended(basicColors);//OK
					if (Number(equationNumber) === 4){
						console.log("applyEquation=extendedOptimization,equationNumber=4");
						basicColors = serviceSelf.extendedOptimization(basicColors, isCouche);
					}
				}else{
					if (Number(equationNumber) === 3){
						console.log("applyEquation=eqDoubleCBXB_50per4010_no4581_no4091,equationNumber=3");
						basicColors = serviceSelf.eqDoubleCBXB_50per4010_no4581_no4091(basicColors);//OK
					}
				}
			}
		}
		if(appEq5 && qty4201 >= 180 && isApply4201_180Eq ){
			basicColors = serviceSelf.eqDivedBy2If4201BigThenOrEq180(basicColors);//not tested
		}
		if(appEq6){
			basicColors = serviceSelf.eq4080_4082_4060(basicColors);//not tested
		}
		return basicColors;
	};
	
	serviceSelf.extendedOptimization = function(basicColors,isCouche){
		var initTotalQty = 0;
        var i = 0;
        for(i = 0; i<basicColors.length; i++){
			initTotalQty += basicColors[i].quantite;
		}
		var basicColorsNo4002=[];
		//remove the 4002
        for(i = 0; i<basicColors.length; i++){
			if(basicColors[i].colorCode!=="4002"){
				basicColorsNo4002[basicColorsNo4002.length]=basicColors[i];
			}
        }
		
		//decrease 50% 4010
        var index4010 = serviceSelf.findIndexOfColorToUse(basicColorsNo4002, "4010");
        if(index4010 !== -1 && isCouche ===false){
            basicColorsNo4002[index4010].quantite = basicColorsNo4002[index4010].quantite / 2;
		}
		
		var finalTotalQty = 0;
        for(i = 0; i<basicColorsNo4002.length; i++){
			finalTotalQty += basicColorsNo4002[i].quantite;
		}

        //regle de trois
        for(i = 0; i<basicColorsNo4002.length; i++){
            var curQty = basicColorsNo4002[i].quantite;
            basicColorsNo4002[i].quantite= curQty * initTotalQty / finalTotalQty;
        }
        return basicColorsNo4002;
	};
	
	serviceSelf.eqDoubleCBXB_50per4010Extended = function(basicColors){

		var initTotalQty = 0;
        var i = 0;
        for(i = 0; i<basicColors.length; i++){
			initTotalQty += basicColors[i].quantite;
		}
		
		//decrease 50% 4010
        var index4010 = serviceSelf.findIndexOfColorToUse(basicColors, "4010");
        if(index4010 !== -1){
            basicColors[index4010].quantite = basicColors[index4010].quantite / 2;
		}
		
        //multiply *2 all the color below if they exist
        var listOfColorCode = [	'4091','4101','4206','4581','4705','4107','4306','4307','4308','4403','4405',
								'4407','4504','4507','4508','4605','4606','4607','4707','4708','4805','4111',
								'4211','4411','4425','4436','4511','4525','4526','4528','4711','4811','4910'];



       for(i = 0; i<basicColors.length; i++){
			basicColors[i].colorCode=basicColors[i].colorCode.trim();
            //if color 4002 divide the qty by 2
            if(basicColors[i].colorCode === "4002"){
                basicColors[i].quantite = basicColors[i].quantite / 2;
            }

            //test if exist in listOfColorCode
            var j = 0;
            for(j = 0; j<listOfColorCode.length; j++){
                if(listOfColorCode[j] === basicColors[i].colorCode){
                    basicColors[i].quantite = basicColors[i].quantite * 2;
                    break;
				}
            }
        }
		
		var finalTotalQty = 0;
        for(i = 0; i<basicColors.length; i++){
			finalTotalQty += basicColors[i].quantite;
		}

        //regle de trois
        for(i = 0; i<basicColors.length; i++){
            var curQty = basicColors[i].quantite;
            basicColors[i].quantite= curQty * initTotalQty / finalTotalQty;
        }
        return basicColors;
	};
	serviceSelf.applyEquationBC = function(basicColors, colorCodeToFirst, colorCodeToLast){
        if(basicColors === undefined || basicColors.length === 0){
            return undefined;
        }

        var indexOfBC_first = serviceSelf.findIndexOfColorToUse(basicColors, colorCodeToFirst);
        var indexOfBC_last = serviceSelf.findIndexOfColorToUse(basicColors, colorCodeToLast);

        var MyArray2 =[];
        var MyArrayIdFormulas =[];

        if( indexOfBC_first!== -1 ){
			MyArray2[MyArray2.length] = basicColors[indexOfBC_first];
        }

        var lengthTarget  = basicColors.length;
        if( indexOfBC_last !== -1 ){
            lengthTarget = lengthTarget - 1;
        }

        while(MyArray2.length < lengthTarget){
            //find max
            var max = 0;
            var indexMax  = -1;
            for(i = 0; i<basicColors.length; i++){
                if( basicColors[i].quantite > max && containsObject(basicColors[i].id_formulaColor,MyArrayIdFormulas)===false  && i !== indexOfBC_first && i !== indexOfBC_last ){
                    max = basicColors[i].quantite;
                    indexMax = i;
                }
            }
            if( indexMax !== -1 ){
                MyArray2[MyArray2.length] = basicColors[indexMax];
                MyArrayIdFormulas.push(basicColors[indexMax].id_formulaColor);
            }
        }

        if( indexOfBC_last !== -1 ){
             MyArray2[MyArray2.length] = basicColors[indexOfBC_last];
        }

        return MyArray2;
}
	serviceSelf.sortDescending = function(basicColors){
		if(basicColors === undefined || basicColors.length === 0){
		    return undefined;
		}

        var MyArray2 =[];
        var MyArrayIdFormulas =[];
        var lengthTarget = basicColors.length;

        while(MyArray2.length < lengthTarget){
            //find max
            var indexMax = -1;
            var max  = 0;
			var i=0;
            for(i = 0; i<basicColors.length; i++){
                if(basicColors[i].quantite >= max && containsObject(basicColors[i].id_formulaColor,MyArrayIdFormulas)===false){
                    max = basicColors[i].quantite;
                    indexMax = i;
                }
            }
            MyArray2[MyArray2.length] = basicColors[indexMax]; //adding an object to the array Object
            MyArrayIdFormulas.push(basicColors[indexMax].id_formulaColor)
        }

        return MyArray2;
		
	};
	
	serviceSelf.findQuantityOfColorInformula = function(basicColors, colorCode){
		
		var indexColor = serviceSelf.findIndexOfColorToUse(basicColors, colorCode)
		if(indexColor === -1) {
		    return 0;
		}
		var qty = basicColors[indexColor].quantite;
		
		return qty;
        }
	
	serviceSelf.findIndexOfColorToUse = function(basicColors, colorToFind){
        var index = -1
        var i =0;
        for(i = 0; i<basicColors.length; i++){
            if (basicColors[i].colorCode.trim() === colorToFind.trim()){
                index = i;
                break;
            }
		}
           
        return index;
	};
	
	serviceSelf.eqDoubleCBXB_50per4010 = function(basicColors){
		var initTotalQty = 0;
        var i = 0;
        for(i = 0; i<basicColors.length; i++){
			initTotalQty += basicColors[i].quantite;
		}
		//decrease 50% 4010
        var index4010 = serviceSelf.findIndexOfColorToUse(basicColors, "4010");
        if(index4010 !== -1){
            basicColors[index4010].quantite = basicColors[index4010].quantite / 2;
		}
		
		//multiply *2 all the color below if they exist
        var listOfColorCode = [	'4101','4206','4705','4107','4306','4307','4308','4403',
								'4405','4407','4504','4507','4508','4605','4606','4607','4707','4708','4805'];
		
		for(i = 0; i<basicColors.length; i++){
			basicColors[i].colorCode=basicColors[i].colorCode.trim();
            //if color 4002 divide the qty by 2
            if(basicColors[i].colorCode === "4002"){
                basicColors[i].quantite = basicColors[i].quantite / 2;
            }

            //test if exist in listOfColorCode
            var j = 0;
            for(j = 0; j<listOfColorCode.length; j++){
                if(listOfColorCode[j] === basicColors[i].colorCode){
                    basicColors[i].quantite = basicColors[i].quantite * 2;
                    break;
				}
            }
        }
		
		var finalTotalQty = 0
        for(i = 0; i<basicColors.length; i++){
			finalTotalQty += basicColors[i].quantite;
		}

        //regle de trois
        for(i = 0; i<basicColors.length; i++){
            var curQty = basicColors[i].quantite;
            basicColors[i].quantite= curQty * initTotalQty / finalTotalQty;
        }
        return basicColors;
	};
	
	serviceSelf.eqDoubleCBXB_50per4010_no4581_no4091 = function(basicColors){
		var initTotalQty = 0;
		var i = 0;
		for(i = 0; i<basicColors.length; i++){
			initTotalQty += basicColors[i].quantite;
		}
		//decrease 50% 4010
		var index4010 = serviceSelf.findIndexOfColorToUse(basicColors, "4010");
		if(index4010 !== -1){
			basicColors[index4010].quantite = basicColors[index4010].quantite / 2;
		}
		
		//multiply *2 all the color below if they exist
 
		var listOfColorCode = [	'4101','4206','4705','4107','4306','4307','4308','4403','4405',
								'4407','4504','4507','4508','4605','4606','4607','4707','4708','4805'];
		for(i = 0; i<basicColors.length; i++){
			basicColors[i].colorCode=basicColors[i].colorCode.trim();
			
			//if color 4002 divide the qty by 2
		    if(basicColors[i].colorCode === "4002"){
			basicColors[i].quantite = basicColors[i].quantite / 2;
		    }
		    //test if exist in listOfColorCode
		    var j = 0;
		    for(j = 0; j<listOfColorCode.length; j++){
			if(listOfColorCode[j] === basicColors[i].colorCode){
			    basicColors[i].quantite = basicColors[i].quantite * 2;
			    break;
					}
		    }
		}
		
		var finalTotalQty = 0
		for(i = 0; i<basicColors.length; i++){
			finalTotalQty += basicColors[i].quantite;
		}

		//regle de trois
		for(i = 0; i<basicColors.length; i++){
		    var curQty = basicColors[i].quantite;
		    basicColors[i].quantite= curQty * initTotalQty / finalTotalQty;
		}
		return basicColors;
	};
	
	serviceSelf.eqDivedBy2If4201BigThenOrEq180 = function(basicColors){
		//
		var initTotalQty = 0;
		var i = 0;
		for(i = 0; i<basicColors.length; i++){
			initTotalQty += basicColors[i].quantite;
		}
		
		//divied by 2 all the color below if they exist
		var listOfColorCode = [	'4025','4640','4440','4047','4041','4188','4084','4082','4030','4985','4934'];
		for(i = 0; i<basicColors.length; i++){
			basicColors[i].colorCode=basicColors[i].colorCode.trim();
			//test if exist in listOfColorCode
			var j = 0;
			for(j = 0; j<listOfColorCode.length; j++){
				if(listOfColorCode[j] === basicColors[i].colorCode){
				    basicColors[i].quantite = basicColors[i].quantite / 2;
				    break;
				}
			}
		}
		
		var finalTotalQty = 0
		for(i = 0; i<basicColors.length; i++){
			finalTotalQty += basicColors[i].quantite;
		}

		//regle de trois
		for(i = 0; i<basicColors.length; i++){
		    var curQty = basicColors[i].quantite;
		    basicColors[i].quantite= curQty * initTotalQty / finalTotalQty;
		}
		return basicColors;
	};
	serviceSelf.eq4080_4082_4060 = function(basicColors){
		//
		var initTotalQty = 0;
		var i = 0;
		for(i = 0; i<basicColors.length; i++){
			initTotalQty += basicColors[i].quantite;
		}
		
		//divied by 2 all the color below if they exist
		var listOfColorCode = [	'4080','4082','4060'];
		for(i = 0; i<basicColors.length; i++){
			basicColors[i].colorCode=basicColors[i].colorCode.trim();
			//test if exist in listOfColorCode
			var j = 0;
			for(j = 0; j<listOfColorCode.length; j++){
				if(listOfColorCode[j] === basicColors[i].colorCode){
				    basicColors[i].quantite = basicColors[i].quantite * 1.25;
				    break;
				}
			}
		}
		
		var finalTotalQty = 0
		for(i = 0; i<basicColors.length; i++){
			finalTotalQty += basicColors[i].quantite;
		}

		//regle de trois
		for(i = 0; i<basicColors.length; i++){
		    var curQty = basicColors[i].quantite;
		    basicColors[i].quantite= curQty * initTotalQty / finalTotalQty;
		}
		return basicColors;
	};
})
.service("SearchFormulasService", function($q,$cordovaSQLite,$rootScope) {
		var serviceSelf=this;	
		serviceSelf.concatResults = function(res,res1,res2,res3,res4,res5,res6){
			var formulas=[];
			var i=0;
			var count=0;
			if(res !== undefined){
				for(i=0;i<res.rows.length;i++){
					formulas[count]=res.rows.item(i);
					count++;
				}
			}
			if(res1 !== undefined){
				for(i=0;i<res1.rows.length;i++){
					formulas[count]=res1.rows.item(i);
					count++;
				}
			}
			if(res2 !== undefined){
				for(i=0;i<res2.rows.length;i++){
					formulas[count]=res2.rows.item(i);
					count++;
				}
			}
			if(res3 !== undefined){
				for(i=0;i<res3.rows.length;i++){
					formulas[count]=res3.rows.item(i);
					count++;
				}
			}
			if(res4 !== undefined){
				for(i=0;i<res4.rows.length;i++){
					formulas[count]=res4.rows.item(i);
					count++;
				}
			}
			if(res5 !== undefined){
				for(i=0;i<res5.rows.length;i++){
					formulas[count]=res5.rows.item(i);
					count++;
				}
			}
			if(res6 !== undefined){
				for(i=0;i<res6.rows.length;i++){
					formulas[count]=res6.rows.item(i);
					count++;
				}
			}
			return formulas;
		}
		serviceSelf.affectFormulas = function(formulas,carName,carImgPath,yearSearchValue,searchObject){
			//var formulas=[];
			var i=0;
			for(i=0;i<formulas.length;i++){
				//formulas[i]=res.rows.item(i);
				//set the apply eq 4201-180
				if(formulas[i].noEquation4201_180 === 1){
					formulas[i].isEquation4201_180=false;
				}else{
					formulas[i].isEquation4201_180=true;
				}
				
				//setting variants
				formulas[i] = serviceSelf.setVariants(formulas[i]);
				//--------------
				
				//convert color RGB
				formulas[i].colorRGB= serviceSelf.argbToRGB(formulas[i].colorRGB);
				//----------------
				
				//convert RGB colors percentage to objects
                if(formulas[i].colorRGBPerc !== undefined && formulas[i].colorRGBPerc !== null){
                    formulas[i].colorRGBPerc= serviceSelf.setRGBPercentage(formulas[i].colorRGBPerc);
                }
				
				//----------------
				
				//set mod date
				formulas[i].Date_cre_mod=serviceSelf.getDDMMYYYY(formulas[i].Date_cre_mod);
				//--------------------
				//set car img
				formulas[i].carName=carName;
				formulas[i].carImgPath=carImgPath;
				//-----------------
				
				
				//set composed and bumper booleans
				if(formulas[i].colorCode.toLowerCase().endsWith("bumper")){
					formulas[i].bumper=true;
					formulas[i].composed=false;
				}else{
					formulas[i].bumper=false;
					if(formulas[i].name_formula.indexOf(" + ")>0){
						formulas[i].composed=true;
					}else{
						formulas[i].composed=false;
					}
				}
				
				//---------
				console.log("SELECTED -> " + formulas[i].colorCode);
			}
			if(yearSearchValue !== ""){
				formulas = serviceSelf.filterByYear(yearSearchValue, formulas);
			}
			
			if(searchObject.colorCode !==undefined && searchObject.colorCode.trim() !== ""){
				//year sorting-------------
				formulas = serviceSelf.sortByYear(formulas);
				//-------------------------
				
				//order by MET and MAT-----
				formulas = serviceSelf.placeMetAndMat(formulas);
				//-------------------------
				
				//additional sorting-----
				formulas = serviceSelf.additionalSorting(formulas, searchObject.colorCode.replaceAll("%",""));
				//-------------------------
			}
			
			//couche/sous-couche sorting
			formulas = serviceSelf.setCoucheSorting(formulas);
			//-------------------------
			return formulas;
		}
		serviceSelf.search=function(searchObject) {
			var lePromise=$q.defer();
			var tableName = searchObject.tableName;
			var carName=searchObject.carName;
			var carImgPath=searchObject.carImgPath;
			
			
			var query = "SELECT * FROM " +tableName + " WHERE type in (?,?) ";
			var queryValues=[];
			//queryValues.push(lastFetchFormula_id);
			
			var garageCoat = $rootScope.chosenGarage.coat;
			queryValues.push(garageCoat);
			queryValues.push('BC');
			
			valuesNumber=0;
			
			/*Filter by code */
			var codeSearchValue="";
			var codeSearch="";
			if(searchObject.colorCode !==undefined && searchObject.colorCode.trim() !== ""){
				codeSearchValue = searchObject.colorCode;
				queryValues.push(codeSearchValue);
				codeSearch = " colorCode like ? ";
				valuesNumber++;
			}
			/**************************/
			
			/*Filter by formula-name */
			var formulaNameSearchValue="";
			var formulaNameSearch="";
			if(searchObject.name_formula !==undefined && searchObject.name_formula.trim() !== ""){
				formulaNameSearchValue = searchObject.name_formula;
				queryValues.push(formulaNameSearchValue);
				formulaNameSearch = " name_formula like ? ";
				valuesNumber++;
			}
			/**************************/
			
			/*Filter by card-number */
			var cardNumberSearchValue="";
			var cardNumberSearch="";
			if(searchObject.cardNumber !==undefined && searchObject.cardNumber.trim() !== ""){
				cardNumberSearchValue = searchObject.cardNumber;
				queryValues.push(cardNumberSearchValue);
				cardNumberSearch = " cardNumber like ? ";
				valuesNumber++;
			}
			
			/*Filter by id_formula */
			var id_formulaSearchValue="";
			var id_formulaSearch="";
			if(searchObject.id_formula !==undefined && searchObject.id_formula.trim() !== "-1"){
				id_formulaSearchValue = searchObject.id_formula;
				queryValues.push(id_formulaSearchValue);
				id_formulaSearch = " id_formula like ? ";
				valuesNumber++;
			}
			
			/**************************/
			
			
			/*filter by version*/
			var versionSearch="";
			if($rootScope.showAllHues === false){
				versionSearch += " (version not like 'S6%' and version not like 'S7%' and version not like 'S8%' and ";
				versionSearch += " version not like 'S9%' and version not like 'S10%') ";
			}
			
			
			/**********************************/
			var whereClause="";
			if(valuesNumber>0 || versionSearch!==""){
				if(codeSearch !== ""){
					whereClause += " AND " + codeSearch;
				}
				
				if(formulaNameSearch !== ""){
					whereClause += " AND " + formulaNameSearch;
				}
				
				if(cardNumberSearch !== ""){
					whereClause += " AND " + cardNumberSearch;
				}
				
				if(id_formulaSearch !== ""){
					whereClause += " AND " + id_formulaSearch;
				}
				
				if(versionSearch !== ""){
					whereClause += " AND " + versionSearch;
				}
			}
			
			
			
			/*Filter by year AFTER database select*/
			var yearSearchValue="";
			if(searchObject.c_year !==undefined && searchObject.c_year.trim() !== ""){
				yearSearchValue = searchObject.c_year;
			}
			/**************************/
			var limit=10000;
			query += whereClause + " ORDER BY colorCode, version LIMIT " + limit;
			console.log("query=" + query);
			
			$cordovaSQLite.execute(db, query, queryValues).then(
				function(res) {
					if(res.rows.length > 0) {
						formulas = serviceSelf.concatResults(res,undefined,undefined,undefined,undefined,undefined,undefined);
						formulas = serviceSelf.affectFormulas(formulas,carName,carImgPath,yearSearchValue,searchObject);
						lePromise.resolve(formulas);
					}else{
						lePromise.resolve(undefined);
					}
					
				},
				function (err) {
					console.log(err.message);
					lePromise.error(err);
				}
			);
			return lePromise.promise;
		};
		
		serviceSelf.additionalSorting = function(formulas, colorCodeSearched){
			//start with the color searched, the others;
			//move [color searched] to first
			var i=0;
			
			var MyArrayColorSearched = [];
			for( i = 0; i< formulas.length; i++){
				if(formulas[i].colorCode.toLowerCase() === colorCodeSearched.toLowerCase()){
					if(	formulas[i].additionalSorting_added === undefined || 
						formulas[i].additionalSorting_added === false){
						MyArrayColorSearched[MyArrayColorSearched.length]=formulas[i];
						formulas[i].additionalSorting_added=true;
					}
				}
			}

			//move [color searched][space][kharadjej] to second;
			for( i = 0; i< formulas.length; i++){
				if(formulas[i].colorCode.toLowerCase().indexOf(colorCodeSearched.toLowerCase() + " ") === 0){
					if(	formulas[i].additionalSorting_added === undefined || 
						formulas[i].additionalSorting_added === false){
						MyArrayColorSearched[MyArrayColorSearched.length]=formulas[i];
						formulas[i].additionalSorting_added=true;
					}
				}
			}

			//move [color searched][kharadjej] to third;
			for( i = 0; i< formulas.length; i++){
				if(	formulas[i].colorCode.toLowerCase().indexOf(colorCodeSearched.toLowerCase())===0 && 
					formulas[i].colorCode.toLowerCase().indexOf(colorCodeSearched.toLowerCase() + " ") !== 0 && 
					formulas[i].colorCode.toLowerCase() !== colorCodeSearched.toLowerCase()){
					if(	formulas[i].additionalSorting_added === undefined || 
						formulas[i].additionalSorting_added === false){
						MyArrayColorSearched[MyArrayColorSearched.length]=formulas[i];
						formulas[i].additionalSorting_added=true;
					}
				}
			}

			//move [...][color searched][...] to fourth;
			for( i = 0; i< formulas.length; i++){
				if(	formulas[i].colorCode.toLowerCase().indexOf(colorCodeSearched.toLowerCase())>-1 && 
					formulas[i].colorCode.indexOf(colorCodeSearched.toLowerCase())!==0 && 
					formulas[i].colorCode.toLowerCase() !== colorCodeSearched.toLowerCase()){
					if(	formulas[i].additionalSorting_added === undefined || 
						formulas[i].additionalSorting_added === false){
						MyArrayColorSearched[MyArrayColorSearched.length]=formulas[i];
						formulas[i].additionalSorting_added=true;
					}
				}
			}
			return MyArrayColorSearched;
		}
		serviceSelf.placeMetAndMat = function(formulas){
			var i=0;
			var indexOfMet = -1;
			for(i = 0; i<formulas.length; i++){
				var fname = formulas[i].name_formula;
				fname = fname.toLowerCase().replace("(couche)", "").trim();
				fname = fname.toLowerCase().replace("(couche 1)", "").trim();
				fname = fname.toLowerCase().replace("(couche 2)", "").trim();
				fname = fname.toLowerCase().replace("(sous-couche)", "").trim()

				if(fname.toLowerCase().endsWith(" met")){
					indexOfMet = i;
					break;
				}
			}

			if(indexOfMet > -1){
				// put met first;
				var MyArray = [];
				MyArray[MyArray.length]=formulas[indexOfMet];
				for(i = 0; i<formulas.length; i++){
					if(i !== indexOfMet){
						MyArray[MyArray.length]=formulas[i];
					}
				}
				formulas = MyArray;
			}

			var indexOfMat  = -1;
			for(i = 0; i<formulas.length; i++){
				var fname = formulas[i].name_formula;
				fname = fname.toLowerCase().replace("(couche)", "").trim();
				fname = fname.toLowerCase().replace("(couche 1)", "").trim();
				fname = fname.toLowerCase().replace("(couche 2)", "").trim();
				fname = fname.toLowerCase().replace("(sous-couche)", "").trim()

				if(fname.toLowerCase().endsWith(" mat")){
					indexOfMat = i;
					break;
				}
			}
			if(indexOfMat > -1){
				// put mat last;
				var MyArray = [];

				for(i = 0; i<formulas.length; i++){
					if(i !== indexOfMat){
						MyArray[MyArray.length]=formulas[i];
					}
				}
				MyArray[MyArray.length]=formulas[indexOfMat];
				formulas = MyArray;
			}
			return formulas;
		}
		serviceSelf.sortByYear = function(formulas){        
			var targetCount = formulas.length;
			var yearMin = -1;
			var MyArray =[];
			while(MyArray.length < targetCount){
				var indexMin = serviceSelf.getMinYearIndex(formulas);
				MyArray[MyArray.length]=formulas[indexMin];
				//remove this element from the array;
				var i;
				var MyArrayTmp =[];
				for(i = 0; i<formulas.length; i++){
					if(formulas[i].id_formula !== formulas[indexMin].id_formula){
						MyArrayTmp[MyArrayTmp.length] = formulas[i];
					}
				}
				formulas = MyArrayTmp;
			}
			return MyArray;
		};
		serviceSelf.getMinYearIndex = function(formulas){
			var yearMin = -1;
			var indexYearMin = 0;
			var i=0;
			for(i = 0; i<formulas.Length; i++){
				var fnamecurrent = formulas(i).name_formula.toLowerCase();
				var years = formulas(i).c_year;
				if(years === undefined){
					continue;
				}
				if(years.trim() === ""){
					continue;
				}
				if(years.indexOf("-") < 0){
					continue;
				}
				if(years.trim() === "-"){
					continue;
				}
				var yearFirst = Number(years.substring(0, years.indexOf("-") - 1).trim());
				if(i === 0){
					yearMin = yearFirst;
					indexYearMin = i;
				}else{
					if(yearFirst < yearMin){
						yearMin = yearFirst;
						indexYearMin = i;
					}
				}
			}
			return indexYearMin;
		};
	
		serviceSelf.isCouche = function(fname){
			var isCouche = false;
			if(fname.toLowerCase().indexOf("(couche)")>-1){
				isCouche = true;
			}
			if(fname.toLowerCase().indexOf("(couche 1)")>-1){
				isCouche = true;
			}
			if(fname.toLowerCase().indexOf("(couche 2)")>-1){
				isCouche = true;
			}
			if(fname.toLowerCase().indexOf("(sous-couche)")>-1){
				isCouche = true;
			}
			return isCouche;
		};
		serviceSelf.getCoucheIndex = function(formulaTab, fname, couchesubstring){
			var lacquer="";
			if(fname.toLowerCase().endsWith("(+ lacquer)")){
				couchesubstring+="(+ lacquer)";
			}else{
				if(fname.toLowerCase().endsWith("(+lqr)")){
					couchesubstring+="(+lqr)";
				}else{
					if(fname.toLowerCase().endsWith("(+lacquer)")){
						couchesubstring+="(+lacquer)";
					}else{
						if(fname.toLowerCase().endsWith("(+ lqr)")){
							couchesubstring+="(+ lqr)";
						}else{
							if(fname.toLowerCase().endsWith("(+ laquer)")){
								couchesubstring+="(+ laquer)";
							}else{
								if(fname.toLowerCase().endsWith("(+laquer)")){
									couchesubstring+="(+laquer)";
								}
							}
						}
					}
				}
			}
			
			
			
			var coucheIndex = -1;
			fname = fname.toLowerCase();
			if(fname.indexOf("(couche)")>-1){
				fname = fname.substring(0, fname.indexOf("(couche)"));
			}
			if(fname.indexOf("(couche 1)")>-1){
				fname = fname.substring(0, fname.indexOf("(couche 1)"));
			}
			if(fname.indexOf("(couche 2)")>-1){
				fname = fname.substring(0, fname.indexOf("(couche 2)"));
			}
			if(fname.indexOf("(sous-couche)")>-1){
				fname = fname.substring(0, fname.indexOf("(sous-couche)"));
			}
			var k=0;
			for(k = 0; k < formulaTab.length; k++){
				if(formulaTab[k].isMoved === undefined || !formulaTab[k].isMoved){
					if(formulaTab[k].name_formula.toLowerCase().trim() === fname + couchesubstring){
						coucheIndex = k;
						break;
					}else{
						if(formulaTab[k].name_formula.toLowerCase().trim() === fname + " " + couchesubstring){
							coucheIndex = k;
							break;
						}
					}
				}
			}
			return coucheIndex;
		}
		serviceSelf.setCoucheSorting = function(formulas){
			var MyArrayCouche = [];
			var i=0;
			for(i = 0; i < formulas.length;i++){
				if(	serviceSelf.isCouche(formulas[i].name_formula) && 
					(formulas[i].isMoved === undefined || !formulas[i].isMoved) ){
					var coucheIndex = serviceSelf.getCoucheIndex(formulas, formulas[i].name_formula, "(couche)");
					var couche1Index = serviceSelf.getCoucheIndex(formulas, formulas[i].name_formula, "(couche 1)");
					var couche2Index = serviceSelf.getCoucheIndex(formulas, formulas[i].name_formula, "(couche 2)");
					var sousCoucheIndex = serviceSelf.getCoucheIndex(formulas, formulas[i].name_formula, "(sous-couche)");

					if(sousCoucheIndex != -1){
						formulas[sousCoucheIndex].isMoved = true;
						MyArrayCouche[MyArrayCouche.length] = formulas[sousCoucheIndex];
					}
					if(coucheIndex != -1){
						formulas[coucheIndex].isMoved = true;
						MyArrayCouche[MyArrayCouche.length] = formulas[coucheIndex];
					}
					if(couche1Index != -1){
						formulas[couche1Index].isMoved = true;
						MyArrayCouche[MyArrayCouche.length] = formulas[couche1Index];
					}
					if(couche2Index != -1){
						formulas[couche2Index].isMoved = true;
						MyArrayCouche[MyArrayCouche.length] = formulas[couche2Index];
					}

				}else{
					if(formulas[i].isMoved === undefined || !formulas[i].isMoved){
						MyArrayCouche[MyArrayCouche.length] = formulas[i];
					}
				}
			}
			return MyArrayCouche;
		};
		serviceSelf.getDDMMYYYY = function(Date_cre_mod){
			if(Date_cre_mod===undefined || Date_cre_mod===""){
				return "";
			}
			var dateTab=Date_cre_mod.split(":");
			return dateTab[0] + "/" + dateTab[1] + "/" + dateTab[2];
		}
		serviceSelf.argbToRGB = function (color) {
				return '#'+ ('000000' + (color & 0xFFFFFF).toString(16)).slice(-6);
			};
			
		serviceSelf.setRGBPercentage = function (formulaRGBPerc) {
			var returnObject=[];
         
			var colorsPercTab=formulaRGBPerc.split(";");
			var it=0;
			for(it=0;it<colorsPercTab.length;it++){
				var colorPerc=colorsPercTab[it].split(":");
				
				var colorRGBFromSplit=colorPerc[0];
				colorRGBFromSplit = serviceSelf.argbToRGB(colorRGBFromSplit);
				
				var percentageFromSplit=colorPerc[1];
				returnObject.push({ colorRGB : colorRGBFromSplit, percentage : percentageFromSplit});

			}
			return returnObject;	
				
		};

			
		serviceSelf.setVariants = function(formula){
			if(formula.variant === undefined || formula.variant ===""){
				return formula;
			}
			formula.variants=[];
			var variantsTab = formula.variant.split("+");
			var it=0;
			for(it=0;it<variantsTab.length;it++){
				if(variantsTab[it].trim() === "B"){
					formula.variants.push({ variantImg : 'variantB.jpg', name : 'Blue'});
				}
				if(variantsTab[it].trim() === "CL"){
					formula.variants.push({ variantImg : 'variantCL.jpg', name : 'Cleaner'});
				}
				if(variantsTab[it].trim() === "CO"){
					formula.variants.push({ variantImg : 'variantCO.jpg', name : 'Coarser'});
				}
				if(variantsTab[it].trim() === "D"){
					formula.variants.push({ variantImg : 'variantD.jpg', name : 'Darker'});
				}
				if(variantsTab[it].trim() === "DRT"){
					formula.variants.push({ variantImg : 'Dirtier.jpg', name : 'variantDRT'});
				}
				if(variantsTab[it].trim() === "F"){
					formula.variants.push({ variantImg : 'variantF.jpg', name : 'Finer'});
				}
				if(variantsTab[it].trim() === "G"){
					formula.variants.push({ variantImg : 'variantG.jpg', name : 'Green'});
				}
				if(variantsTab[it].trim() === "L"){
					formula.variants.push({ variantImg : 'variantL.jpg', name : 'Lighter'});
				}
				if(variantsTab[it].trim() === "R"){
					formula.variants.push({ variantImg : 'variantR.jpg', name : 'Red'});
				}
				if(variantsTab[it].trim() === "Y"){
					formula.variants.push({ variantImg : 'variantY.jpg', name : 'Yellow'});
				}
			}
			return formula;			
		}
		serviceSelf.filterByYear = function(chosenYear, formulas){
			var fileredFormulas = [];
			for(i=0;i<formulas.length;i++){
				var c_year = formulas[i].c_year;
				if(c_year.indexOf("-") >0 ){
					var years=c_year.split("-");
					var yearMin = years[0].trim();
					var yearMax = 0;
					if(years.length>1){
						yearMax = years[1].trim();
					}
					
					var addFormula = true;
					if(Number(chosenYear)<Number(yearMin)){
						addFormula=false;
					}else{
						if(Number(chosenYear)>Number(yearMax) && Number(yearMax)!=0){
							addFormula=false
						}
					}
					if(addFormula){
						fileredFormulas.push(formulas[i]);
					}
				}
			}
			return fileredFormulas;
		};
})
.service('myHttpService', function($q,$http) {
	var serviceSelf=this;
	//var authorizationtoken= "Basic ZmYwYTJhNTQtYjA3ZS00YTI4LWIyOTUtYzI3NzU4NDRjMTc4OjNlMmUyMGEyLTM4ZDItNGZiZC1hZjQ5LTBiOGVmMWNiM2FmYg==";
	cordova.plugin.http.setDataSerializer('urlencoded');
	
	//cordova.plugin.http.setHeader('amazonapaintsrest.restlet.net', 'Authorization', authorizationtoken);
	
	serviceSelf.getStopSyncData=function() {
		console.log("getStopSyncData Service")
		var lePromise=$q.defer();
		// disable SSL cert checking, only meant for testing purposes, do NOT use in production!
		cordova.plugin.http.setSSLCertMode('nocheck', function() {
			console.log('success setSSLCertMode!');
			const options = {
			  method: 'get'
			};
			 
			//cordova.plugin.http.sendRequest('https://amazonapaintsrest.restlet.net/v1/main/stopSync.txt', options, function(response) {
			cordova.plugin.http.sendRequest('https://www.amazonapaints.com/testftp/stopSync.txt', options, function(response) {
				
			// prints 200
				console.log(response.status);
				response.data = response.data.trim();
				lePromise.resolve(JSON.parse(response.data));
			  
			}, function(response) {
				cordova.plugin.http.sendRequest('http://www.amazonapaints.com/testftp/stopSync.txt', options, function(response) {
				
				// prints 200
					console.log(response.status);
					response.data = response.data.trim();
					lePromise.resolve(JSON.parse(response.data));
				  
				}, function(response) {
					// prints 403
					console.log(response.status);

					//prints Permission denied
					console.log(response.error);
					lePromise.error(response.error);
				});
			});
			
		}, function(err) {
			console.log('error setSSLCertMode ');
			console.log(err);
			lePromise.error(err);
				
		});
		
		return lePromise.promise;
	};
	serviceSelf.getSyncData=function() {
		console.log("getSyncData Service")
		var lePromise=$q.defer();
		// disable SSL cert checking, only meant for testing purposes, do NOT use in production!
		cordova.plugin.http.setSSLCertMode('nocheck', function() {
			console.log('success setSSLCertMode!');
			
			//cordova.plugin.http.get('https://amazonapaintsrest.restlet.net/v1/main/dbSync.txt', {}, {}, function(response) {
			cordova.plugin.http.get('https://www.amazonapaints.com/testftp/dbSync.txt', {}, {}, function(response) {			
				console.log(response.status);
				response.data = response.data.trim();
				lePromise.resolve(JSON.parse(response.data));
			}, function(response) {
			 	cordova.plugin.http.get('http://www.amazonapaints.com/testftp/dbSync.txt', {}, {}, function(response) {			
					console.log(response.status);
					response.data = response.data.trim();
					lePromise.resolve(JSON.parse(response.data));
				}, function(response) {
				  console.error(response.error);
				});
			});
			
		}, function(err) {
			console.log('error setSSLCertMode ');
			console.log(err);
			lePromise.error(err);
				
		});
		
		return lePromise.promise;
	};
	
});
