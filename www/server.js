/*jslint nomen: true, vars: true, white: true, sloppy: true */
/*global Buffer: false, clearInterval: false, clearTimeout: false, console: false, exports: false, global: false, module: false, process: false, querystring: false, require: false, setInterval: false, setTimeout: false, __filename: false, __dirname: false */
var conf = require('nconf');

  conf.argv()
  .env()
  .file({ file: __dirname + '/../config.json' })
  .defaults({
    'server': {
      'host': '127.0.0.1',
      'port': '8000'
    },
    'captcha': {
      'privateKey': ''
    },
    'SES': {
      'AWSAccessKeyID': '',
      'AWSSecretKey': ''
    }
  });

var express = require('express'),
    app     = express(),
    bodyParser = require('body-parser'),
    simple_recaptcha = require('simple-recaptcha'),
    nodemailer = require("nodemailer");

var mta = nodemailer.createTransport("SES", {
    AWSAccessKeyID: conf.get('SES:AWSAccessKeyID'),
    AWSSecretKey: conf.get('SES:AWSSecretKey')
  });


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(require('compression')());

app.get('/api/user', function (req, res) {
    res.status(200);
    res.json({ip: req.ip});
});

app.use(express.static(__dirname + '/static/'));

app.post('/', function(req, res) {

  var privateKey = conf.get('captcha:privateKey');
  console.log(privateKey);

  var ip = req.ip,
      challenge = req.body.recaptcha_challenge_field,
      response = req.body.recaptcha_response_field,

      name_field = req.body.name,
      email_field = req.body.email,

      validatEmail = function(x) {
        var atpos=x.indexOf('@');
        var dotpos=x.lastIndexOf('.');
        if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length)
        {
          return false;
        } else {
          return true;
        }
      };

  if (typeof name_field !== 'string' || name_field.length < 1 ) {

     console.log('Missing name value!');

     return res.end(JSON.stringify({
         status: 'error',
         message: 'Missing name value!',
         fields: ['name-field']
     }, null, 3));
  }

  if (typeof email_field !== 'string' || validatEmail(email_field) === false ) {

     console.log('Incorrect e-mail address!');

     return res.end(JSON.stringify({
         status: 'error',
         message: 'Incorrect e-mail address!',
         fields: ['email-field']
     }, null, 3));
  }

  simple_recaptcha(privateKey, ip, challenge, response, function(err) {

      res.setHeader('Content-Type', 'application/json');

      if (err) {
         console.log('Captcha could not be verified');
         return res.end(JSON.stringify({
             status: 'error',
             message: 'Security text did not match! Please retry!',
             fields: ['recaptcha_response_field']
         }, null, 3));
      }

      if (req.body.name.length>0) {

      }

      res.end(JSON.stringify({
          status: 'ok',
          message: 'Request successfully submitted. Thank you!'
      }, null, 3));
  });

  // Every filed is allright
  console.log('New signup request from:' + name_field + ', ' + email_field + ', ' + ip);

  var mailOptions = {
    from: 'peter.volgyesi@gmail.com',
    to: 'peter.volgyesi@gmail.com',
    subject: 'WebGME Registration Request',
    text: 'New signup request from:' + name_field + ', ' + email_field + ', ' + ip
  };

  mta.sendMail(mailOptions, function (error, response) {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Message sent: " + response.message);
    }
  });
});

app.listen(conf.get('server:port'), conf.get('server:host'), function() {
  console.log('Server running at http://' + conf.get('server:host') + ':' + conf.get('server:port') + '/');
});
