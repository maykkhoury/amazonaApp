angular.module('amazona.services')
.service('MySyncService', function($http, $q, $timeout) {
  var API_BASE_URL = 'https://happywallpaints.com/api/';
  var API_KEY = '3e04f8c2-5d4b-4f11-94d8-a5b79f4d123a';

  function saveRowsToDb(tableName, rows, onDone, onError) {
    db.transaction(function(tx) {
      tx.executeSql("DELETE FROM " + tableName);
      rows.forEach(function(row) {
        var columns = Object.keys(row);
        var values = Object.values(row);
        var placeholders = columns.map(() => '?').join(', ');
        var sql = "INSERT OR REPLACE INTO " + tableName + " (" + columns.join(', ') + ") VALUES (" + placeholders + ")";
        tx.executeSql(sql, values);
      });
    }, onError, onDone);
  }

  function updateAppSyncTable(version, onDone, onError) {
    db.transaction(function(tx) {
      tx.executeSql("DELETE FROM appSync");
      tx.executeSql(
        "INSERT INTO appSync (theVersion, stopSyncIndex, forceSync) VALUES (?, ?, ?)",
        [version, 0, 0]
      );
    }, onError, onDone);
  }
  
  this.getTables = function() {
    return $http({
      method: 'GET',
      url: API_BASE_URL + 'list_tables.php',
      headers: {
        'X-API-KEY': API_KEY
      }
    }).then(function(response) {
      if (response.data.success) {
        console.log("Tables retrieved:", response.data.tables);
        return {
            tables: response.data.tables,
            version: response.data.version || null
          };
      } else {
        console.error("API Error:", response.data.error);
        return $q.reject(response.data.error);
      }
    }).catch(function(error) {
      console.error("HTTP Error:", error);
      return $q.reject("HTTP request failed");
    });
  };

  this.syncAllTables = function(tables, onProgressUpdate, version) {
    var deferred = $q.defer();

    function syncTable(index) {
      if (index >= tables.length) {
        onProgressUpdate && onProgressUpdate("All tables synced.");
        updateAppSyncTable(version,
            function() {
              onProgressUpdate && onProgressUpdate("appSync table updated.");
              deferred.resolve("Synchronization completed.");
            },
            function(err) {
              onProgressUpdate && onProgressUpdate("Failed to update appSync table.");
              deferred.resolve("Synchronization completed with warning.");
            }
          );
        return;
      }

      var tableName = tables[index];
      onProgressUpdate && onProgressUpdate("Syncing table: " + tableName);

      $http({
        method: 'GET',
        url: API_BASE_URL + 'get_table_data.php',
        params: { table: tableName },
        headers: { 'X-API-KEY': API_KEY }
      }).then(function(response) {
        if (!response.data.success) {
          onProgressUpdate && onProgressUpdate("Failed to load " + tableName + ": " + (response.data.error || 'Unknown error'));
          return syncTable(index + 1);
        }

        saveRowsToDb(
          tableName,
          response.data.data,
          function() {
            onProgressUpdate && onProgressUpdate("Table synced: " + tableName);
            syncTable(index + 1);
          },
          function(err) {
            onProgressUpdate && onProgressUpdate("Transaction error on " + tableName);
            syncTable(index + 1);
          }
        );

      }).catch(function(err) {
        var errMsg = (err && err.message) || (err && err.statusText) || JSON.stringify(err);
        var shouldRetry = errMsg.includes("ERR_SSL_PROTOCOL_ERROR");

        if (shouldRetry) {
          onProgressUpdate && onProgressUpdate("SSL error on " + tableName + ": retrying...");

          $timeout(function() {
            $http({
              method: 'GET',
              url: API_BASE_URL + 'get_table_data.php',
              params: { table: tableName },
              headers: { 'X-API-KEY': API_KEY }
            }).then(function(retryResponse) {
              if (retryResponse.data.success) {
                saveRowsToDb(
                  tableName,
                  retryResponse.data.data,
                  function() {
                    onProgressUpdate && onProgressUpdate("Retry success: " + tableName);
                    syncTable(index + 1);
                  },
                  function() {
                    onProgressUpdate && onProgressUpdate("Transaction error after retry on " + tableName);
                    syncTable(index + 1);
                  }
                );
              } else {
                onProgressUpdate && onProgressUpdate("Retry failed: " + tableName + ": " + retryResponse.data.error);
                syncTable(index + 1);
              }
            }).catch(function() {
              onProgressUpdate && onProgressUpdate("Retry failed for " + tableName);
              syncTable(index + 1);
            });

          }, 1000); // retry after 1 second

        } else {
          onProgressUpdate && onProgressUpdate("HTTP error for " + tableName + ": skipping...");
          syncTable(index + 1);
        }
      });
    }

    syncTable(0);
    return deferred.promise;
  };
});
