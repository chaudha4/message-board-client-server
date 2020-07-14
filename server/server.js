'use strict';

/**
 * Unfortunately, Node.js doesn't support ES6's import yet. If you 
 * really want to use new ES6/7 features in NodeJS, you can compile 
 * it using Babel. Here's an example server.
 * https://github.com/babel/example-node-server
 * 
 */

const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');
const helmet      = require('helmet');
const path        = require("path");

const apiRoutes   = require('./routes/api.js');

const app = express();


// The following takes control of dnsPrefetchControl, frameguard
// hidePoweredBy, hsts, ieNoOpen, noSniff, xssFilter by deafult
app.use(helmet()); 

// Only allow your site to send the referrer for your own pages.
app.use(helmet.referrerPolicy({ policy: 'same-origin' }))

//Only allow your site to be loading in an iFrame on your own pages.
app.use(helmet.frameguard({ action: 'sameorigin' }))

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Some Debugs. Can be removed
console.log("process.cwd() - %s", process.cwd());
console.log("__dirname - %s", __dirname);

// add middlewares to serve react app
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

//Sample front-end
app.route('/b/:board/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/board.html');
  });
  
app.route('/b/:board/:threadid')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/thread.html');
  });


function notFoundMW() {
  return new Promise((resolve, reject) => {
  app.use(function(req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found');
  });
  resolve();
})};

//Start our server and tests!
function startServer() {
  return new Promise((resolve, reject) => {
    app.listen(process.env.PORT || 3000, function () {
      console.log("Server running at %o", this.address());
      if(process.env.NODE_ENV==='test') {
        console.log('Running Tests...');
        setTimeout(function () {
          try {
            runner.run();
          } catch(e) {
            var error = e;
              console.log('Tests are not valid:');
              console.log(error);
          }
        }, 1500);
      }
    });
    resolve();
  });  
}

//Routing for API 
apiRoutes(app).then(notFoundMW).then(startServer);   


//module.exports = app; //for testing
