'use strict';

var alexa = require('alexa-nodekit');
var http = require('http');

var config = require('./config.js');

var options = {
  host: config.homehost,
  port: config.homeport
};

// Accept incoming Amazon Echo request.
// The Intent Request will be parsed for the Intent type and then forwarded to its proper function.
exports.index = function(req, res) {
  var sessionId;
  var userId;
  console.log(req.body);
  if(req.body.request.type === 'LaunchRequest') {
    alexa.launchRequest(req.body);
    // TODO For now, we don't care about the session or the user id, we will refactor this later.
    sessionId = alexa.sessionId;
    userId = alexa.userId;
    alexa.response('Welcome to Sonos. What can I play for you?', {
      title: 'Alexa-Sonos',
      subtitle: 'Welcome to the Sonos app',
      content: 'Some commands are "Play favorite xxx" or "Play playlist xxx"'
    }, false, function (error, response) {
      if(error) {
        return res.status(500).jsonp({message: error});
      }
      return res.jsonp(response);
    });
  } else if(req.body.request.type === 'IntentRequest') {
    alexa.intentRequest(req.body);
    // TODO For now, we don't care about the session or the user id, we will refactor this later.
    sessionId = alexa.sessionId;
    userId = alexa.userId;
    var intent = alexa.intentName;
    var slots = alexa.slots;
    if(intent === 'PlayPlaylist') {
      options.path='/family%20room/playlist/'+encodeURIComponent(req.body.request.intent.slots.Playlist.value);
      http.request(options, function(response){
        console.log(response.body);
        alexa.response('Playlist requested.', {
          title: 'Alexa-Sonos',
          subtitle: 'Playlist requested',
          content: 'Playlist requested.'
        }, true, function (error, response) {
          if(error) {
            return res.status(500).jsonp(error);
          }
          return res.jsonp(response);
        });
      }).end();
    } else if(intent === 'PlayFavorite') {
      console.log('favorite');
      options.path='/family%20room/favorite/'+encodeURIComponent(req.body.request.intent.slots.Favorite.value);
      http.request(options, function(response){
        alexa.response('Playing '+req.body.request.intent.slots.Favorite.value, {
          title: 'Alexa-Sonos',
          subtitle: 'Favorite requested: '+req.body.request.intent.slots.Favorite.value,
          content: 'Favorite requested.'
        }, true, function (error, response) {
          if(error) {
            return res.status(500).jsonp(error);
          }
          return res.jsonp(response);
        });
      }).end();
    } else if(intent === 'StartMusic') {
      console.log('start');
      options.path='/family%20room/play';
      console.log(options.path);
      http.request(options, function(response){
        alexa.response('Playing', {
          title: 'Alexa-Sonos',
          subtitle: 'Music started',
          content: 'Music started.'
        }, true, function (error, response) {
          if(error) {
            return res.status(500).jsonp(error);
          }
          return res.jsonp(response);
        });
      }).end();
    } else if(intent === 'StopMusic') {
      console.log('stop');
      options.path='/family%20room/pause';
      http.request(options, function(response){
        console.log(response.body);
        alexa.response('Pausing', {
          title: 'Alexa-Sonos',
          subtitle: 'Music stopped',
          content: 'Music stopped.'
        }, true, function (error, response) {
          if(error) {
            return res.status(500).jsonp(error);
          }
          return res.jsonp(response);
        });
      }).end();
    } else {
      alexa.response('Unknown intention, please try a different command.', {
        title: 'Alexa-Sonos',
        subtitle: 'Unknown intention.',
        content: 'Unknown intention, please try a different command.'
      }, false, function (error, response) {
        if(error) {
          return res.status(500).jsonp(error);
        }
        return res.jsonp(response);
      });
    }
  } else {
    alexa.sessionEndedRequest(req.body);
    // TODO For now, we don't care about the session or the user id, we will refactor this later.
    sessionId = alexa.sessionId;
    userId = alexa.userId;
    var sessionEndReason = alexa.reason;
    alexa.response(function (error, response) {
      if(error) {
        return res.status(500).jsonp(error);
      }
      return res.jsonp(response);
    });
  }
};