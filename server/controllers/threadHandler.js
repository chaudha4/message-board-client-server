/*
 *  Useful Links
 *  https://javascript.info/promise-chaining
 *
 *
 *
 */

"use strict";

var expect = require("chai").expect;

var MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

module.exports = function(app) {

  let db_url = process.env.DB;
  if (!process.env.DB) {
    db_url = "mongodb+srv://user001:SR9nRZ0gOr8uQJSs@cluster0-lskl2.mongodb.net/test?retryWrites=true&w=majority";
  }

  console.log("Setting the MongoDB URL to %s", db_url);

  const client = new MongoClient(encodeURI(db_url), { useUnifiedTopology: true });
 
  const dbName = "FCC_Mesg_DB";
  const boardTable = "Boards";
  const replyTable = "Replies";

  // I can POST a thread to a specific message board by passing form data text and delete_password to /api/threads/{board}.
  // (Recomend res.redirect to board page /b/{board}) Saved will be _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on),
  // reported(boolean), delete_password, & replies(array).

  this.insertMesgBoardThread = function(req, res) {
    return new Promise((resolve, reject) => {
      // a call to promise.then returns a promise
      // connect() return a promise
      // insertOne() returns a promise that we must return explicitly !!
      client
        .connect()
        .then(() => {
          // Return a Promise to be consumed by next then
          return client
            .db(dbName)
            .collection(boardTable)
            .insertOne(
              // Return a promise
              {
                board: req.params.board,
                thread_id: new ObjectID(),
                text: req.body.text,
                created_on: new Date(),
                bumped_on: new Date(),
                reported: false,
                delete_password: req.body.delete_password
              }
            );
        })
        .then(data => {
          // Final then. No need to return a promise now
          console.log("Inserted a new Board Thread - then");
          //client.close();
          return resolve(data);
        })
        .catch(err => {
          console.log("Inserted a new Board Thread - catch", err);
          //client.close();
          return reject(err);
        });
    }); // new Promise
  }; //insertMesgBoardThread

  // This method demonstartes transactions with commit and rollback, promise chaining.
  this.insertReply = function(req, res) {
    return new Promise((resolve, reject) => {
      // Start Transaction - https://docs.mongodb.com/manual/core/transactions/
      let session = null;
      client
        .connect()
        .then(() => {
          console.log("Inserted a new Reply (1st then)");
          // Step 1: Start a Client Session
          session = client.startSession();

          // Step 2: Optional. Define options to use for the transaction
          const transactionOptions = {
            readPreference: "primary",
            readConcern: { level: "local" },
            writeConcern: { w: "majority" }
          };

          //session.startTransaction(transactionOptions);
          session.startTransaction();

          return client
            .db(dbName)
            .collection(replyTable)
            .insertOne(
              // Return a promise for next then
              {
                board: req.params.board,
                thread_id: ObjectID(req.body.thread_id),
                reply: req.body.text,
                created_on: new Date(),
                bumped_on: new Date(),
                reported: false,
                delete_password: req.body.delete_password
              }
            );
        }) // 1st then
        .then(data => {
          //console.log("Inserted a new Reply (2nd then) %o", data);
          return client
            .db(dbName)
            .collection(boardTable)
            .updateOne(
              {
                board: req.params.board,
                thread_id: ObjectID(req.body.thread_id)
              },
              [
                {
                  $set: {
                    text: { $concat: ["$text", "- updateOne "] },
                    bumped_on: "$$NOW"
                  }
                }
              ] // Example of aggregation pipe
              //{  $set: {text: "Test Transactions", bumped_on: new Date()} }, // Without aggregation pipe - Concat not possible
            );
        }) // 2nd then
        .then(data => {
          console.log("Aggregate the replies (3rd then)");
          //
          // Agrregation pipes are enclosed with []. See https://docs.mongodb.com/manual/core/aggregation-pipeline/
          // The following does the similar thing but won't update the DB since aggregate() is like a find() or a map-reduce
          // Aggregate reurns cursor - so need to us toArray() (or forEach() etc)

          return client
            .db(dbName)
            .collection(boardTable)
            .aggregate([
              { $match: { board: req.params.board } }, // pipe 1 - match this board and pass to next stage
              { $project: { _id: -1, text: 1, bumped_on: 1 } }, // pipe 2 - $project − Remove clutter. Just Pass text and Bumped_On to next stage
              { $sort: { bumped_on: -1 } } // pipe 3 - Sort the data in descending order
            ])
            .toArray();
        }) // 3rd then
        .then(data => {
          console.log("All done (final then) - Commit");
          session.commitTransaction();
          return resolve(data);
        }) // final then
        .catch(err => {
          console.log("Rollback hit (catch) ", err);
          session.abortTransaction();
          return reject(err);
        });
    }); // new Promise
  }; //insertMesgBoardThread

  this.reportMesgBoardThread = function(req, res) {
    return new Promise((resolve, reject) => {
      client.connect().then(() => {
        client
          .db(dbName)
          .collection(boardTable)
          .updateOne(
            {
              board: req.body.board,
              thread_id: ObjectID(req.body.thread_id)
            },
            { $set: { reported: true, bumped_on: new Date() } }, // Will always find one Thread array
            (err, data) => {
              if (err) return reject(err);
              console.log(
                "Updateone board:%s Thread:%s Result:%o",
                req.body.board,
                req.body.thread_id,
                data.result
              );
              return resolve(data);
            }
          );
      });
    }); // new Promise
  }; //reportMesgBoardThread

  this.reportReply = function(req, res) {
    return new Promise((resolve, reject) => {
      client.connect().then(() => {
        client
          .db(dbName)
          .collection(replyTable)
          .updateOne(
            {
              board: req.body.board,
              thread_id: ObjectID(req.body.thread_id),
              _id: ObjectID(req.body.reply_id)
            },
            { $set: { reported: true, bumped_on: new Date() } }, // Will always find one Thread array
            (err, data) => {
              if (err) return reject(err);
              console.log(
                "reportReply board:%s Thread:%s Reply:%s Updated:%i",
                req.body.board,
                req.body.thread_id,
                req.body.reply_id,
                data.result.nModified
              );
              return resolve(data);
            }
          );
      });
    }); // new Promise
  }; //reportMesgBoardThread

  this.deleteMesgBoardThread = function(req, res) {
    return new Promise((resolve, reject) => {
      client.connect().then(() => {
        client
          .db(dbName)
          .collection(boardTable)
          //.deleteOne(
            .deleteMany(
            //{ board: req.body.board, thread_id: ObjectID(req.body.thread_id) }, // Query
            { board: req.body.board }, // Query
            (err, data) => {
              if (err) return reject(err);
              if (!data) reject("Failed to delete board - Empty Response");
              
              // Now delete all replies from reply table
              client.db(dbName).collection(replyTable).deleteMany({board: req.body.board}, (err1, data1) => {
                if (err1) return reject(err1);
                if (!data1) reject("Failed to delete Reply - Empty Response");
                
                // All done. Reolve the Promise
                console.log("deleteMesgBoardThread - ", data.result);
                return resolve(data);                
              });
            }
          );
      });
    }); // new Promise
  }; //deleteMesgBoardThread

  this.deleteReply = function(req, res) {
    return new Promise((resolve, reject) => {
      client.connect().then(() => {
        client
          .db(dbName)
          .collection(replyTable)
          .updateOne(
            {
              board: req.body.board,
              thread_id: ObjectID(req.body.thread_id),
              _id: ObjectID(req.body.reply_id)
            },
            { $set: { reply: "[deleted]", bumped_on: new Date() } }, // Will always find one Thread array
            (err, data) => {
              if (err) return reject(err);
              console.log("-----------Marked Deleted", data.result);
              return resolve(data);
            }
          );
      });
    }); // new Promise
  }; //deleteMesgBoardThread

  // GET an array of the most recent 10 bumped threads on the board with only the most recent 3 replies from /api/threads/{board}.
  this.getMesgBoardThreads = function (req, res) {
    return new Promise((resolve, reject) => {
      client.connect()
        .then(() => {
          client
            .db(dbName)
            .collection(boardTable)
            .find({ board: req.params.board }, { threads: true }) // Query and return threads only
            .sort({ bumped_on: -1 }) // -1 for descending
            .limit(10)
            .toArray((err, data) => {
              if (err) return reject(err);
              console.log("-----------GET returned", JSON.stringify(data));
              let promiseArr = [];
              data.forEach(item => {
                promiseArr.push(
                  new Promise((resolve, reject) => {
                    client
                      .db(dbName)
                      .collection(replyTable)
                      .find(
                        {
                          board: item.board,
                          thread_id: ObjectID(item.thread_id)
                        },
                        { reply: true }
                      ) // Query and return Reply only
                      .sort({ bumped_on: -1 }) // -1 for descending
                      .limit(3)
                      .toArray((errReply, dataReply) => {
                        if (errReply) return reject(errReply);
                        console.log(
                          "-----------Reply Returned",
                          JSON.stringify(dataReply)
                        );
                        item.reply = dataReply;
                        return resolve();
                      });
                  })
                ); // push
              }); // forEach

              // Example of Waiting on multiple Promises !!
              Promise.all(promiseArr).then(function (values) {
                //console.log(values);
                console.log(
                  "-----------GET returned - AFter Adding Reply ",
                  JSON.stringify(data)
                );
                return resolve(data); // data should be build by now since all promises are filled
              });

              //return resolve(data);
            });
        })
        .catch( err => {
          console.log("Error %o", err);
          reject(err);
        })
    }); // new Promise
  }; //getMesgBoardThreads

  this.getReply = function(req, res) {
    return new Promise((resolve, reject) => {
      client.connect().then(() => {
        client
          .db(dbName)
          .collection(replyTable)
          .find(
            { board: req.body.board, thread_id: ObjectID(req.body.thread_id) },
            { reply: true }
          ) // Query and return Reply only
          .sort({ bumped_on: -1 }) // -1 for descending
          .limit(10)
          .toArray((err, data) => {
            if (err) return reject(err);
            console.log("-----------GET returned", JSON.stringify(data));
            return resolve(data);
          });
      });
    }); // new Promise
  };
  
  /*
    route_path: '/getThread'
    actual_request_URL: '/getThread?boardName=b123&threadId=6754'
    req.query: {boardName: 'b123', threadId: '6754'}
    GET /api/getThread?boardName=b5&thread_id=5f063a33aa1155007eb97287 ::ffff:127.0.0.1 {} {} { boardName: 'b5', thread_id: '5f063a33aa1155007eb97287' }
  */  
  
 
  this.getOneThread = function(req, res) {
    console.log("getOneThread()- Entering with %s %s", req.query.boardName, req.query.thread_id);
    return new Promise((resolve, reject) => {
      client.connect().then(() => {
        client
          .db(dbName)
          .collection(boardTable)
          .findOne(
            { board: req.query.boardName, thread_id: ObjectID(req.query.thread_id) },
            { reply: true },
            ((err, data) => {
              if (err) return reject(err);
              
              // Now add replies to this Object from replyTable
                  client.db(dbName).collection(replyTable).find({
                        board: req.query.boardName,
                        thread_id: ObjectID(req.query.thread_id)
                      },
                      { reply: true }
                    ) // Query and return Reply only
                    .sort({ bumped_on: -1 }) // -1 for descending
                    //.limit(3)
                    .toArray((errReply, dataReply) => {
                      if (errReply) return reject(errReply);
                      console.log("getOneThread()- Adding Replies - ", JSON.stringify(dataReply));
                      data.reply = dataReply;
                    
                      // All done. Now resolve the promise.
                      console.log("getOneThread()-  returned %o %s", data, JSON.stringify(data));
                      return resolve(data);                    
                    });
            }));
      });
    }); // new Promise
  }; //this.getOneThread


  
 
  this.updateThreadText = function(req, res) {
    console.log("updateThreadText()- Entering with %s %s %s", req.query.boardName, req.query.thread_id, req.query.text);
    return new Promise((resolve, reject) => {
      client.connect().then(() => {
        client
          .db(dbName)
          .collection(boardTable)
          .updateOne(
            { board: req.query.boardName, thread_id: ObjectID(req.query.thread_id) },
            { $set: {text: req.query.text, bumped_on: new Date()} },
            ((err, data) => {
              if (err) return reject(err);
                   
                      // All done. Now resolve the promise.
                      console.log("updateThreadText()-  returned %o %s", data, JSON.stringify(data));
                      return resolve(data);                    
                   
            }));
      });
    }); // new Promise
  }; //this.updateThreadText  
  
  
  
}; //module.exports
