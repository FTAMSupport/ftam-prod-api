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
// Require `PhoneNumberFormat`.
const PNF = require('google-libphonenumber').PhoneNumberFormat;
// Get an instance of `PhoneNumberUtil`.
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();



function get_user_id(req, res, next) {
  return req.payload.username;
}

router.post('/toggledb', (req, res) => {
  const message = req.body.Body || 'close';
  const from = req.body.From || '+14795448054';
  var phone = {
    "phone": from
  };
  //const uri = config.api_uri + "/api/restaurant/getAllPhoneNumbers/" + from;
  //var uri = config.api_uri + "/api/restaurant/getAllPhoneNumbers/" + encodeURIComponent(from);
  var uri = config.api_uri + "/api/restaurant/validatePhoneNumber";

  //-- check if it is a valid/trusted phone number. else no response
  request({
    url: uri,
    method: 'POST',
    json: phone
  }, function (error, response, body) {
    console.log(error);
    if (response && response.statusCode === 200) {
      //if (JSON.parse(response.body).length !== 0) {
      if (response.body.length !== 0) {
        console.log("trusted phone number");
        //Assuming that there is a unique phone number associated with each restaurant
        //Obtain the associated restaurant id
        //const restaurantId = JSON.parse(response.body)[0]["restaurantId"];
        const restaurantId = response.body[0]["restaurantId"];
        const entityId = response.body[0]["entityId"];

        //-- intent: Open/Close
        if (message.includes('open') || message.includes('Open') || message.includes('close') || message.includes('Close')) {
          if (message.includes('open') || message.includes('Open')) {
            var api_uri = config.api_uri + "/api/restaurant/toggleFlag/" + entityId + "/" + restaurantId + "/" + false;
            var smsMessage = 'Thank you. Now the Foodtruck status is set to OPEN';
          }
          if (message.includes('close') || message.includes('Close')) {
            var api_uri = config.api_uri + "/api/restaurant/toggleFlag/" + entityId + "/" + restaurantId + "/" + true;
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
              }, function (error, message) {
                if (!error) {
                  console.log(message);
                  return res.send(200, "SMS sent");
                } else {
                  console.log(error);
                  return res.send(400, "SMS not sent");
                }
              });
            } else {
              client.messages.create({
                to: '+14795448054',
                from: config.twilio_from_number,
                body: 'Error in toggling the DB status for restaurantId ' + restaurantId
              }, function (error, message) {
                if (!error) {
                  console.log(message);
                  return res.send(200, "Toggle SMS sent");
                } else {
                  console.log(error);
                  return res.send(400, "Toggle SMS not sent");
                }
              });
            }
          });
        }
        //-- intent2: Order Confirmation
        else if (message.includes('order') || message.includes('Order')) {
          //--1.Parse the message and extract the order number
          var numberPattern = /\d+/g;
          var orderno = message.match(numberPattern);
          console.log(orderno);
          //--2.Obtain the customer phone number against the order number
          // /'
          if (orderno[0]) {
            var api_uri = config.api_uri + "/api/order/getByOrderNumber/" + orderno[0];
            request({
              url: api_uri,
              method: 'GET'
            }, function (error, response, body) {
              if (response && response.statusCode === 200) {
                if (JSON.parse(response.body)[0]["customer_name"]) {
                  smsMessage = "Hi " + JSON.parse(response.body)[0]["customer_name"] + "! ";
                }
                smsMessage = smsMessage + "Your order#" + orderno[0] + " is ready for pickup."
                // Parse number with country code and keep raw input.
                var tel = phoneUtil.parseAndKeepRawInput(JSON.parse(response.body)[0]["customer_phone_no"], 'US');
                console.log(phoneUtil.format(tel, PNF.E164));
                var cust_tel = phoneUtil.format(tel, PNF.E164);
                client.messages.create({
                  to: cust_tel, //customer phonenumber
                  from: config.twilio_from_number,
                  body: smsMessage
                }, function (error, message) {
                  if (!error) {
                    console.log(message);
                    return res.send(200, "Order Confirmation SMS sent");
                  } else {
                    console.log(error);
                    return res.send(400, "Order Confirmation SMS not sent");
                  }
                });
              } else {
                client.messages.create({
                  to: '+14795448054', //admin notification
                  from: config.twilio_from_number,
                  body: 'Error in sending confirmation to the customer with Order#' + orderno[0]
                }, function (error, message) {
                  if (!error) {
                    console.log(message);
                    return res.send(200, "Order Confirmation Error SMS sent");
                  } else {
                    console.log(error);
                    return res.send(400, "Order Confirmation Error SMS not sent");
                  }
                });
              }
            });
          }


          //--3.Send a text message to the customer
        }
        //-- NO intent
        else {
          console.log("un-identified incoming sms message - no action " + message);
          res.send(403, "un-identified incoming sms message - no action " + message);
        }
      } else {
        console.log('DB untrusted phone number - access error!');
        res.send(403, 'DB untrusted phone number - access error!');
      }
    } else {
      res.send(400, 'DB Error: ' + error);
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
