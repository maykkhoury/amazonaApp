angular.module('amazona.services')
.service("myHttpService", function($q,$http) {
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