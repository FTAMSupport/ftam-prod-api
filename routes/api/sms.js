var mongoose = require('mongoose');
var router = require('express').Router();
var twilio = require('twilio');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
var config = require('../../config');
var client = new twilio(config.twilio_sid, config.twilio_auth_token);
var Order = mongoose.model('Order');
const request = require('request-promise');
const uuid = require('uuid4');
var auth = require('../auth');
var acl = require('../../authorization').getAcl();

function get_user_id(req, res, next) {
  return req.payload.username;
}

router.post('/toggledb', (req, res) => {
  const message = req.body.Body || 'close';
  const from = req.body.From || '+14795448054'; 
  const uri = config.api_uri + "/api/restaurant/getAllPhoneNumbers/" + from;
  //-- check if it is a valid/trusted phone number. else no response
  request({
      url: uri,
      method: 'GET'
    }, function (error, response, body) {
      if (response && response.statusCode === 200) {
        if (JSON.parse(response.body).length !== 0) {
          console.log("trusted phone number");
          //Assuming that there is a unique phone number associated with each restaurant
          //Obtain the associated restaurant id
          const restaurantId = JSON.parse(response.body)[0]["restaurantId"];
          //-- parse the message and orchestrate as per the intent
          //-- intent: Open/Close
          if (message.includes('open') || message.includes('Open') || message.includes('close') || message.includes('Close')) {
            if (message.includes('open') || message.includes('Open')){
              var api_uri = config.api_uri + "/api/restaurant/toggleFlag/" + restaurantId + "/" + false;
              var smsMessage = 'Thank you. Now the Foodtruck status is set to OPEN';
            }
            if(message.includes('close') || message.includes('Close')){
              var api_uri = config.api_uri + "/api/restaurant/toggleFlag/" + restaurantId + "/" + true;
              var smsMessage = 'Thank you. Now the Foodtruck status is set back to CLOSE';
            }
            request({
              url: api_uri,
              method: 'PUT',
              body: 'toggle'
            }, function (error, response, body) {
              if (response && response.statusCode === 200) {
                client.messages.create({
                  to: from,
                  from: config.twilio_from_number,
                  body: smsMessage
                }, function(error, message) {
                  if (!error) {
                    console.log(message);
                    return res.send(200,"SMS sent");
                  }
                  else{
                    console.log(error);
                    return res.send(400,"SMS not sent");
                  }
                });
              } else {
                client.messages.create({
                  to: '+14795448054',
                  from: config.twilio_from_number,
                  body: 'Error in toggling the DB status for restaurantId ' + restaurantId
                }, function(error, message) {
                  if (!error) {
                    console.log(message);
                    return res.send(200,"Toggle SMS sent");
                  }
                  else{
                    console.log(error);
                    return res.send(400,"Toggle SMS not sent");
                  }
                });
              }
            });
          }
          //-- intent2: Order Confirmation
          else if (message.includes('order') || message.includes('Order')) {
            
          }
          //-- NO intent
          else {
            console.log("un-identified incoming sms message - no action " + message);
            res.send(403, "un-identified incoming sms message - no action " + message);
          }
        } 
        else {
          console.log('DB untrusted phone number - access error!');
          res.send(403, 'DB untrusted phone number - access error!');
        }
      }
      })
  });

router.post('/twiml', (req, res) => {
  const twiml = new MessagingResponse();
  if (req.body.Body.includes('done')) {
    twiml.message('done');
    var api_uri = config.api_uri + "/updateOrder/:order_number"; 
  } else if (req.body.Body.includes('working')) {
    twiml.message('working');
  } else if (req.body.Body.includes('status')) {
    twiml.message('Your order will be ready in 10min');
  } else {
    twiml.message('how can I help you?');
  }
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(twiml.toString());
});

module.exports = router;
