var express = require('express'),
    app     = express(),
    simple_recaptcha = require('simple-recaptcha');

app.use(express.bodyParser());
app.use(express.compress());
app.use(express.static(__dirname + '/static/'));

app.post('/', function(req, res) {

  var privateKey = '6Lf0GPESAAAAAN0R6DpSvloI7AAA3Zy3ZnGMnNyS'; // publicKey: 6Lf0GPESAAAAANkosxMm9DyYwxjZko3FsPPHr6ZX
  var ip = req.ip;
  var challenge = req.body.recaptcha_challenge_field;
  var response = req.body.recaptcha_response_field;

  simple_recaptcha(privateKey, ip, challenge, response, function(err) {

      res.setHeader('Content-Type', 'application/json');

      if (err) {
         console.log('Captcha could not be verified');
         return res.end(JSON.stringify({
             status: "OK",
             message: "Captcha could not be verified"
         }, null, 3));
      }

      console.log('Captcha verified');

      res.end(JSON.stringify({ status: "OK" }, null, 3));
  });

});

app.listen(8080, function() {
  console.log('Server running at http://127.0.0.1:8080/');
});