const testFolder = '\\\\192.168.0.188\\';
//const fs = require('fs');
const fs = window.require('fs');
const path = require('path');
const {shell} = window.require('electron');

const createDir = (client, project, selectedFiles) => {

  const newDir = () => {
    fs.exists(path.join('X:\\waterjetDashboard\\', client), (exists) => {
      if (exists) {
        fs.mkdir(path.join('X:\\waterjetDashboard\\', client, project), (err) => {
          if (err) {
              return console.error(err);
          }
          console.log('Sub on existing Directory created successfully!');
        });
      } else {
        fs.mkdirSync(path.join('X:\\waterjetDashboard\\', client, project), { recursive: true }, (err) => {
          if (err) {
            return console.error(err);
          }
          console.log('SubDirectory created successfully! recursive');
        });

        // fs.mkdir(path.join('X:\\waterjetDashboard\\', client), (err) => {
        //   if (err) {
        //       return console.error(err);
        //   }
        //   console.log('Main Directory created successfully!');
        // });
        // fs.mkdir(path.join('X:\\waterjetDashboard\\', client, project), (err) => {
        //   if (err) {
        //       return console.error(err);
        //   }
        //   console.log('SubDirectory created successfully!');
        // });
      }
    });   
  }

  const writeFiles =  (selectedFiles, secondAttempt) => {
    fs.exists(path.join('X:\\waterjetDashboard\\',  client, project), (exists) => {
      if (exists) {
        selectedFiles.forEach((item, index) => {
          console.log(item, index);
          try {
            fs.copyFileSync(item.path, path.join('X:\\waterjetDashboard\\', client, project, item.name));
            // , fs.constants.COPYFILE_EXCL);      
            // // Get the current filenames
            // // after the function
            // getCurrentFilenames();
            // console.log("\nFile Contents of world.txt:",
            //   fs.readFileSync("hello.txt", "utf8"));
          }
          catch (err) {
            console.log(err);
          }
        });
      } else if(secondAttempt) {
        setTimeout(() => {
          console.log('tookTwo');
          writeFiles(selectedFiles, null);
        }, 1000)
      } else if (secondAttempt == null) {
        console.log('files could not be written');
      }
      else {
        setTimeout(() => {
          console.log('didntTake');
          writeFiles(selectedFiles, true)
        }, 1000)
      }
    })
  }

  newDir();
  writeFiles(selectedFiles, false);
};

const dbStuff = (crudOp, values, status) => {
    const mysql = window.require('mysql2');
    const SqlString = require('sqlstring');
    const util = require('util');
    const phraseGET = 'SELECT * FROM `projects`';
    const phrase = 'SELECT * FROM `projects`';
    //const value1 = val1;
    const value2 = 'Test Value 2';
    const formValues = values;
    const readValues = [];
    //const phraseNew = 'INSERT INTO `projects`(`client_name`, `project_name`, `material`, `thickness`, `unit`, `quantity`, `comments`, `status`, `cut_time`, `labor_time`, `files`, `date`, `id`) VALUES ([value-1],[value-2],[value-3],[value-4],[value-5],[value-6],[value-7],[value-8],[value-9],[value-10],[value-11],[value-12],[value-13])';
    let crud = crudOp;

    const createNewProject = (values) => {
      let sqlEntry = "";
      let sqlData = "";
      let sqlPhrase = "";
      values.forEach((item, input) => {
        for(let prop in item) {
          console.log(prop);
          console.log(item[prop]);
          if(prop == "entry") {
            sqlEntry += "`" + item[prop] + "`, ";
          } else if(prop == "data") {
            sqlData += '"' + item[prop] + '", ';
          }
        }
      });
      sqlEntry = sqlEntry.slice(0,-2);
      sqlData = sqlData.slice(0,-2);

      sqlPhrase = 'INSERT INTO `projects`(' + sqlEntry + ', `status`, `cut_time`, `labor_time`' + ') VALUES (' + sqlData + ', "pending", "0", "0")';

      return sqlPhrase;
    }

    const retrieveProjects = (status) => {
      const sqlPhrase = 'SELECT * FROM `projects` WHERE status="' + status + '"';

      return sqlPhrase;
    }

    const runQuery = (crud, phrase) => {
      let $query;

      switch (crud) {
        case 'create':
          console.log('op to create');
          $query = createNewProject(values);
          break;
        case 'read':
          console.log('op to read');
          $query = retrieveProjects(status);
          break;
        case 'update':
          console.log('op to update');
          break;
        case 'delete':
          console.log('op to delete');
          break;
        default:
          console.log('no op recognized...crud');
      }
      console.log('queryRunning');
      console.log(formValues);
      // Perform a query
      //const $query = phrase;
      // const $query = createNewProject(values);
      const userId = 1;
      //const sql = SqlString.format('SELECT * FROM completed` WHERE id = ?', [userId]);
      const sql = SqlString.format($query);
      console.log(sql); // SELECT * FROM users WHERE id = 1
      // execute will internally call prepare and query
      // connection.execute(
      //     phrase,
      //     function(err, results, fields) {
      //     console.log(results); // results contains rows returned by server
      //     console.log(fields); // fields contains extra meta data about results, if available
      
      //     // If you execute same statement again, it will be picked from a LRU cache
      //     // which will save query preparation time and give better performance
      //     }
      // );
      // node native promisify
      const query = util.promisify(connection.query).bind(connection);

      connection.query(sql, function(err, rows, fields) {
          if(err){
              console.log("An error ocurred performing the query.");
              console.log(err);
              return;
          }

          console.log("Query succesfully executed", rows);

          //results.push(rows);
          
          //window.localStorage.setItem('dbchunk', readValues);

          if (crud == "read") {
            let numVar = 0;
            for(const row in rows) {
              numVar++;
              //window.localStorage.setItem('pending' + numVar , rows[row]);
            }
          }
      });
      //Close the connection
      connection.end(function(){
          // The connection has been closed
      });
    };

    const dbConn = (phrase) => {
      const $query = phrase;
      const sql = SqlString.format($query);
      console.log(sql); // SELECT * FROM users WHERE id = 1

      // execute will internally call prepare and query
      // connection.execute(
      //     phrase,
      //     function(err, results, fields) {
      //     console.log(results); // results contains rows returned by server
      //     console.log(fields); // fields contains extra meta data about results, if available
      
      //     // If you execute same statement again, it will be picked from a LRU cache
      //     // which will save query preparation time and give better performance
      //     }
      // );
      // node native promisify
      const query = util.promisify(connection.query).bind(connection);

      connection.query(sql, function(err, rows, fields) {
          if(err){
              console.log("An error ocurred performing the query.");
              console.log(err);
              return;
          }

          console.log("Query succesfully executed", rows);
          indexedDB(rows);

          //results.push(rows);
          
          //window.localStorage.setItem('dbchunk', readValues);

          // if (crud == "read") {
          //   let numVar = 0;
          //   for(const row in rows) {
          //     numVar++;
          //     window.localStorage.setItem('pending' + numVar , rows[row]);
          //   }
          // }
      });
      //Close the connection
      connection.end(function(){
          // The connection has been closed
      });
    }

    const indexedDB = (projectsData) => {

      const DB_NAME = 'waterjet_projects';
      const DB_VERSION = 1; // Use a long long for this value (don't use a float)
      const DB_STORE_NAME = 'projects';

      let db;

      // Used to keep track of which view is displayed to avoid uselessly reloading it
      //var current_view_pub_key;

      function openDb() {
        console.log("openDb ...");
        var req = window.indexedDB.open(DB_NAME, DB_VERSION);
        req.onsuccess = function (evt) {
          // Equal to: db = req.result;
          db = this.result;
          console.log("openDb DONE");
        };
        req.onerror = function (evt) {
          console.error("openDb:", evt.target.errorCode);
        };
    
        req.onupgradeneeded = function (evt) {
          console.log("openDb.onupgradeneeded");
          var store = evt.currentTarget.result.createObjectStore(
            DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
    
          store.createIndex('client_name', 'client_name', { unique: false });
          store.createIndex('project_name', 'project_name', { unique: false });
          store.createIndex('status', 'status', { unique: false });
        };
      }

      function getObjectStore(store_name, mode) {
        var tx = db.transaction(store_name, mode);
        return tx.objectStore(store_name);
      }
    
      function clearObjectStore() {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var req = store.clear();
        req.onsuccess = function(evt) {
          displayActionSuccess("Store cleared");
          //displayPubList(store);
        };
        req.onerror = function (evt) {
          console.error("clearObjectStore:", evt.target.errorCode);
          displayActionFailure(this.error);
        };
      }

      function displayActionSuccess(msg) {
        msg = typeof msg != 'undefined' ? "Success: " + msg : "Success";
        //$('#msg').html('<span class="action-success">' + msg + '</span>');
        console.log(msg)
      }
      function displayActionFailure(msg) {
        msg = typeof msg != 'undefined' ? "Failure: " + msg : "Failure";
        //$('#msg').html('<span class="action-failure">' + msg + '</span>');
        console.log(msg)
      }
      function resetActionStatus() {
        console.log("resetActionStatus ...");
        //$('#msg').empty();
        console.log("resetActionStatus DONE");
      }

      function addProject(project) {
        console.log("addPublication arguments:", arguments);
        var obj = { clientName: project.client_name, projectName: project.project_name, status: project.status };
    
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var req;
        try {
          req = store.add(project);
        } catch (e) {
          if (e.name == 'DataCloneError')
            displayActionFailure("This engine doesn't know how to clone a Blob, " +
                                 "use Firefox");
          throw e;
        }
        req.onsuccess = function (evt) {
          console.log("Insertion in DB successful");
          displayActionSuccess();
          //displayPubList(store);
        };
        req.onerror = function() {
          console.error("addPublication error", this.error);
          displayActionFailure(this.error);
        };
      }
    
      openDb();

      setTimeout(() => {
        projectsData.forEach((item) => {
          addProject(item);
          console.log(item);
        });
      }, 1000)
    }
    
    const db_config = {
      host: '192.168.0.188',
      user: 'user1',
      password: 'passww0rd',
      database: 'waterjetDashboard'
    };

    const results = [];
      
    var connection;
      
    function handleDisconnect() {
      console.log('connectAttaempt');
      connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                      // the old one cannot be reused.
    
      connection.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
          console.log('error when connecting to db:', err);
          setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }           
        else {
          console.log('connected to db');
          //getDB(crud, phraseGET);
          const connectToDB = new Promise((resolve, reject) => {
            resolve(runQuery(crud, phrase));
            //resolve(indexedDB(phrase));
            resolve(dbConn(phrase));
          });

          connectToDB;
          // connectToDB.then(() => {
          //   if (crud == "read") {
          //     results.push(readValues);
          //     for(const val in readValues) {
          //       console.log(readValues[val]);
          //     }
          //     console.log(readValues.length);
          //     readValues.forEach((item) => {
          //       console.log(item)
          //     })
          //     window.localStorage.setItem('dbchunk', readValues);
          //   }
          // });
        }                          // to avoid a hot loop, and to allow our node script to
      });                                     // process asynchronous requests in the meantime.
                                              // If you're also serving http, display a 503 error.
      connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
          handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
          throw err;                                  // server variable configures this)
        }
      });
    }

    handleDisconnect();
    return results;
}

export { dbStuff, createDir };
//dbStuff(crudOp);

// module.exports = {
//     dbStuff
// }