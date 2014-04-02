var express = require('express'),
    app     = express(),
    simple_recaptcha = require('simple-recaptcha');

app.use(express.bodyParser());
app.use(express.compress());
app.use(express.static(__dirname + '/static/'));

app.post('/', function(req, res) {

  var privateKey = '6Lf0GPESAAAAAN0R6DpSvloI7AAA3Zy3ZnGMnNyS'; // publicKey: 6Lf0GPESAAAAANkosxMm9DyYwxjZko3FsPPHr6ZX

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

});

app.listen(8080, function() {
  console.log('Server running at http://127.0.0.1:8080/');
});