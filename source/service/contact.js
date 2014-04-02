var express = require('express');
var app     = express();

app.use(express.bodyParser());

app.post('/myaction', function(req, res) {
  res.send('You sent the name "' + req.body.name + '".');
});

app.listen(8080, function() {
  console.log('Server running at http://127.0.0.1:8080/');
});