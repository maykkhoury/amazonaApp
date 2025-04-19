angular.module('amazona.services')
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
});