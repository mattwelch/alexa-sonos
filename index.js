'use strict';

var express = require('express');
var app = express();
var bodyParser     = require('body-parser');

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());

var controller = require('./sonos.controller');


app.post('/', controller.index);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});