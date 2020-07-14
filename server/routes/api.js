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

var ThreadHandler = require("../controllers/threadHandler.js");

module.exports = function (app) {

  let th = new ThreadHandler(app);

  function installThreadRoute() {
    return new Promise((resolve, reject) => {
      console.log("Installing Thread Route");
      app
        .route("/api/threads/:board")

        .get(function (req, res, next) {
          console.log(
            "Called",
            req.method,
            req.url,
            req.ip,
            req.params,
            req.body,
            req.query
          );
          th.getMesgBoardThreads(req, res)
            //.then((data) => {console.log("getBoard", data); resolve(data); })
            //.then((data) => {addThread(req,res,data);} )
            .then(data => {
              res.send(data);
            })
            .catch(err => {
              console.log(err);
              res.send("Failure");
            });
        }) //get

        .post(function (req, res, next) {
          console.log(
            "Called-%s Method-%s",
            req.method,
            req.url,
            req.ip,
            req.params,
            req.body,
            req.query
          );
          th.insertMesgBoardThread(req, res)
            //.then((data) => {console.log("getBoard", data); resolve(data); })
            //.then((data) => {addThread(req,res,data);} )
            .then(() => {
              //res.send("done");
              res.redirect("/b/" + req.params.board + "");
            })
            .catch(err => {
              console.log(err);
              res.send("Failure");
            });
        }) //post

        .put(function (req, res, next) {
          console.log(
            "Called %s URL-%s IP-%s Params-%O Body-%O Query-%o",
            req.method,
            req.url,
            req.ip,
            req.params,
            req.body,
            req.query
          );
          th.reportMesgBoardThread(req, res)
            //.then((data) => {console.log("getBoard", data); resolve(data); })
            //.then((data) => {addThread(req,res,data);} )

            .then(data => {
              res.send("done");
              resolve(data);
            })

            .catch(err => {
              console.log(err);
              res.send("Failure");
            });
        }) //put

        .delete(function (req, res, next) {
          console.log(
            "Called",
            req.method,
            req.url,
            req.ip,
            req.params,
            req.body,
            req.query
          );
          th.deleteMesgBoardThread(req, res)
            .then(data => {
              if (data.result && data.result.n > 0) {
                res.send("done");
              } else {
                res.send("Failure");
              }
              resolve(data);
            })
            .catch(err => {
              console.log(err);
              res.send("Failure");
            });
        }); //delete //route

      console.log("Installing Replies Route");
      app
        .route("/api/replies/:board")

        .get(function (req, res, next) {
          console.log(
            "Called",
            req.method,
            req.url,
            req.ip,
            req.params,
            req.body,
            req.query
          );
          th.getReply(req, res)
            //.then((data) => {console.log("getBoard", data); resolve(data); })
            //.then((data) => {addThread(req,res,data);} )
            .then(() => {
              res.send("done");
              //res.redirect("/b/" + req.body.board);
            })
            .catch(err => {
              console.log(err);
              res.send("Failure");
            });
        }) //get

        .post(function (req, res, next) {
          console.log(
            "Called",
            req.method,
            req.url,
            req.ip,
            req.params,
            req.body,
            req.query
          );
          th.insertReply(req, res)
            //.then((data) => {console.log("getBoard", data); resolve(data); })
            //.then((data) => {addThread(req,res,data);} )
            .then(() => {
              res.send("done");
              //res.redirect("/b/" + req.params.board + "");
            })
            .catch(err => {
              console.log(err);
              res.send("Failure");
            });
        }) //post

        .put(function (req, res, next) {
          console.log(
            "Called",
            req.method,
            req.url,
            req.ip,
            req.params,
            req.body,
            req.query
          );
          th.reportReply(req, res)
            //.then((data) => {console.log("getBoard", data); resolve(data); })
            //.then((data) => {addThread(req,res,data);} )

            .then(data => {
              res.send("done");
              resolve(data);
            })

            .catch(err => {
              console.log(err);
              res.send("Failure");
            });
        }) //put

        .delete(function (req, res, next) {
          console.log(
            "Called",
            req.method,
            req.url,
            req.ip,
            req.params,
            req.body,
            req.query
          );
          th.deleteReply(req, res)
            .then(data => {
              if (data.result && data.result.n > 0) {
                res.send("done");
              } else {
                res.send("Failure");
              }
              resolve(data);
            })
            .catch(err => {
              console.log(err);
              res.send("Failure");
            });
        }); //delete //route

      resolve();
    }); // Promise
  }

  function installCustomRoute() {
    return new Promise((resolve, reject) => {
      console.log("Installing Custom Routes");
      app
        .route("/api/getThread/")
        .get(function (req, res, next) {
          console.log(
            "Called",
            req.method,
            req.url,
            req.ip,
            req.params,
            req.body,
            req.query
          );
          th.getOneThread(req, res)
            .then(data => {
              res.send(data);
            })
            .catch(err => {
              console.log(err);
              res.send("Failure");
            });
        }) //get /api/getThread/


      app
        .route("/api/updateThreadText/")
        .get(function (req, res, next) {
          console.log(
            "Called",
            req.method,
            req.url,
            req.ip,
            req.params,
            req.body,
            req.query
          );
          th.updateThreadText(req, res)
            .then(data => {
              res.send(data);
            })
            .catch(err => {
              console.log(err);
              res.send("Failure");
            });
        }) //get /api/updateThreadText/      

      resolve();
    }); // Promise;
  }

  /**
  return connect2DB()
    .then(installThreadRoute)
    .then(installCustomRoute);
  */

 return installThreadRoute()
  .then(installCustomRoute);


}; //module.exports
