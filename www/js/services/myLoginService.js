angular.module('amazona.services')
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
    
});