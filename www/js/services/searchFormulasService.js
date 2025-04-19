angular.module('amazona.services')
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
});