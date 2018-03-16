           // Import express
            const express = require('express');
            const app = express();
            // Import csvtojson module
            const csv = require('csvtojson');
            // Import Mongodb
            const mongoClient = require('mongodb').MongoClient,
              assert = require('assert');

            // Server up and running on port 7600
            const server = app.listen(7600, (err, callback) => {
              if (err) {
                console.log(err);
              } else {
                console.log('Your nodejs server running on port 7600');
              }
            });

            // Mongodb Connection URL 
            const url = 'mongodb://localhost:27017/csvfilereader';

            // Use connect method to connect to the Server
            mongoClient.connect(url, (err, db) => {
              assert.equal(null, err);

              console.log("Connected correctly to server");

              insertDocuments(db, function () {
                db.close();
              });
            });


            const insertDocuments = (db, callback) => {
              // Get the documents collection
              let collection = db.collection('documents');

              // CSV File Path
              const csvFilePath = 'file.csv';

              /**
               * Read csv file and save every row of
               * data on mongodb database
               */
              csv()
                .fromFile(csvFilePath)
                .on('csv', (csvRow) => {
                  csvRow.forEach(function (element) {
                    // Save data on mongo database
                    collection.insertOne({ email: element }, (err, result) => {
                      if (err) {
                        console.log(err);
                      } else {
                        callback(result);
                      }
                    });
                  }, this);
                })
                .on('done', (error) => {
                  console.log('end')
                });
            }

