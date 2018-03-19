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

router.post('/sms', (req, res) => {
      //-- check if a valid/trusted phone number. else no response
      const message = req.body.Body || 'close';
      const from = req.body.From || '+14795448054'; 
      const uri = config.api_uri + "/api/restaurant/getAllPhoneNumbers/" + from;
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
              //-- intent1: Open
              if (message.includes('open') || message.includes('Open')) {
                var api_uri = config.api_uri + "/api/restaurant/toggleFlag/" + restaurantId + "/" + false;
                request({
                  url: api_uri,
                  method: 'PUT',
                  body: 'test'
                }, function (error, response, body) {
                  if (response && response.statusCode === 200) {
                    client.messages.create({
                      to: from,
                      from: config.twilio_from_number,
                      body: 'Thank you. Now the Foodtruck status is set to OPEN'
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
                        return res.send(200,"SMS sent");
                      }
                      else{
                        console.log(error);
                        return res.send(400,"SMS not sent");
                      }
                    });
                  }
                });
              }
              //-- intent2: Close
              else if (message.includes('close') || message.includes('Close')) {
                var api_uri = config.api_uri + "/api/restaurant/toggleFlag/" + restaurantId + "/" + true;
                request({
                  url: api_uri,
                  method: 'PUT',
                  body: 'test'
                }, function (error, response, body) {
                  if (response && response.statusCode === 200) {
                    client.messages.create({
                      to: from,
                      from: config.twilio_from_number,
                      body: 'Thank you. Now the Foodtruck status is set back to CLOSE'
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
                        return res.send(200,"SMS sent");
                      }
                      else{
                        console.log(error);
                        return res.send(400,"SMS not sent");
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

    // Create new Order
    router.post('/', function (req, res, next) {
      let order = new Order(req.body.order);
      let payment = req.body.payment;
      console.log("payment info" + payment);
      // PP -> Authorize and Charge - OLD
      // PP -> Create an Accept Payment Transaction - NEW
      var api_uri = config.api_uri + "/api/stripePay";
      request({
        url: api_uri,
        method: 'POST',
        json: payment
      }, function (error, response, body) {
        //    if (response && response.statusCode === 200) {
        if (response && response.statusCode === 200 && response.body.status === "succeeded") {
          order.transaction_id = response.body.balance_transaction;
          order.charge_id = response.body.id;
          //order.transaction_id = response.body.transactionResponse.transId; 
          order.version = "1";
          order.order_key = uuid();
          order.order_status = "inprocess";
          order.set_piad = true;
          console.log('PP successfull!');

          /*       // Built-in save method to save to order details to the Database
                order.save().then(function () {
                  console.log('Order saved successfully!');
                  return res.json({
                    order: order.toPostJSON()
                  });
                }).catch(next); */

          // Built-in save method to save to order details to the Database
          order.save().then(function () {
            const order1 = order.toPostJSON();
            let message = 'Order # ' + order1.order_number;

            if (order1.customer_name) {
              message = message + ' \n ' + 'Name - ' + order1.customer_name;
            }

            if (order1.customer_phone_no) {
              message = message + ' \n ' + 'Phone #' + order1.customer_phone_no;
            }

            for (let value of order1.line_items) {
              message = message + '\n' + (value.quantity + ' QTY ' + value.name);
              if (value.notes) {
                message = message + ' - ' + value.notes;
              }
            }
            var toPhoneNumbers = order1.contact;
            //const numbers = [order1.contact[0],order1.contact[1],order1.contact[2]];
            const numbers = [];
            if (order1.contact[0]) {
              numbers.push(order1.contact[0]);
            }
            if (order1.contact[1]) {
              numbers.push(order1.contact[1]);
            }
            if (order1.contact[2]) {
              numbers.push(order1.contact[2]);
            }

            Promise.all(
                numbers.map(number => {
                  return client.messages.create({
                    to: number.phone,
                    from: config.twilio_from_number, //'+14797778337',
                    body: message
                  });
                })
              )
              .then(messages => {
                console.log('Success! The SID for this SMS message is:');
                console.log(message.sid);
                console.log('Message sent on:');
                console.log(message.dateCreated);
                console.log('Order saved successfully!');
                return res.json({
                  order: order.toPostJSON()
                });
              })
              .catch(err => console.error(err));
            /*         var toPhoneNumbers = order1.contact; 
                    Object.keys(toPhoneNumbers).map(function(key, index) {
                      console.log(toPhoneNumbers[key].phone);
                      client.messages.create({
                          to:  toPhoneNumbers[key].phone, //'+14795448054',
                          from: '+14797778337',
                          body: message
                         // mediaUrl: 'https://static.wixstatic.com/media/ac525e_61fec83160824138b2bfa5cd94e3d77b~mv2.png/v1/fill/w_266,h_264,al_c,usm_0.66_1.00_0.01/ac525e_61fec83160824138b2bfa5cd94e3d77b~mv2.png'
                      }, function(error, message) {
                          if (!error) {
                              console.log('Success! The SID for this SMS message is:');
                              console.log(message.sid);
                              console.log('Message sent on:');
                              console.log(message.dateCreated);
                              console.log('Order saved successfully!');
                              return res.json({
                                order: order.toPostJSON()
                                });
                          } else {
                                      console.log('Oops! There was an error.');
                        }
                      })
                   }); */
          }).catch(next);
        } else {
          console.log('PP error!');
          return res.json(error);
        }
      });
    });

    // return a list of order items associated with a sepcific Entity_Id
    router.get('/getByEntityId/:entity_id', function (req, res, next) {
      console.log(req.params.entity_id);
      // Find all data in the Order collection 
      Order.find().where("entity_id", req.params.entity_id).exec(function (err, orders) {
        if (err) return console.error(err);
        return res.json(orders);
      });
    });

    // return a list of order items associated with a sepcific Restaurnat_Id
    router.get('/getByRestaurantId/:restaurant_id', function (req, res, next) {
      console.log(req.params.restaurant_id);
      // Find all data in the Order collection 
      Order.find().where("restaurant_id", req.params.restaurant_id).exec(function (err, orders) {
        if (err) return console.error(err);
        return res.json(orders);
      });
    });

    // return a list of order items associated with a sepcific restaurant_id and entity_id
    router.get('/getByEntityIdAndRestaurantId/:entity_id/:restaurant_id', function (req, res, next) {
      console.log(req.params.entity_id);
      console.log(req.params.restaurant_id);
      Order.find({
          $and: [{
            "entity_id": req.params.entity_id
          }, {
            "restaurant_id": req.params.restaurant_id
          }]
        })
        .exec(function (err, orders) {
          if (err) return console.error(err);
          return res.json(orders);
        });
    });

    // return a list of order items associated with a sepcific Entity_Id
    router.get('/getByEntityIdAndOrderStatus/:entity_id', function (req, res, next) {
      console.log(req.params.entity_id);
      // Find all data in the Order collection 
      Order.find({
        order_status: req.query.order_status
      }).where("entity_id", req.params.entity_id).exec(function (err, orders) {
        if (err) return console.error(err);
        return res.json(orders);
      });
    });

    // return a list of order items associated with a sepcific Restaurnat_Id
    router.get('/getByRestaurantIdAndOrderStatus/:restaurant_id', function (req, res, next) {
      console.log(req.params.restaurant_id);
      // Find all data in the Order collection 
      Order.find({
        order_status: req.query.order_status
      }).where("restaurant_id", req.params.restaurant_id).exec(function (err, orders) {
        if (err) return console.error(err);
        return res.json(orders);
      });
    });

    // return a list of order items associated with a sepcific restaurant_id and entity_id
    router.get('/getByEntityIdAndRestaurantIdAndOrderStatus/:entity_id/:restaurant_id', function (req, res, next) {
      console.log(req.params.entity_id);
      console.log(req.params.restaurant_id);
      Order.find({
          $and: [{
            "entity_id": req.params.entity_id
          }, {
            "restaurant_id": req.params.restaurant_id
          }, {
            "order_status": req.query.order_status
          }]
        })
        .exec(function (err, orders) {
          if (err) return console.error(err);
          return res.json(orders);
        });
    });

    // return a list of order items associated with a sepcific restaurant_id and entity_id
    router.get('/getByOrderStatus/:entity_id/:restaurant_id', auth.required, function (req, res, next) {
      console.log(req.params.entity_id);
      console.log(req.params.restaurant_id);
      Order.find({
          $and: [{
            "entity_id": req.payload.entityId
          }, {
            "restaurant_id": req.payload.restaurantId
          }, {
            "order_status": req.query.order_status
          }]
        })
        .exec(function (err, orders) {
          if (err) return console.error(err);
          return res.json(orders);
        });
    });

    // update the details of a specific order item
    router.put('/updateOrder/:entity_id/:restaurant_id/:order_number', function (req, res, next) {
      console.log(req.params.entity_id);
      // Find all data in the Order collection 
      //var query = {'order_number': req.params.order_number};
      let query = {
        $and: [{
          "entity_id": req.params.entity_id
        }, {
          "restaurant_id": req.params.restaurant_id
        }, {
          'order_number': req.params.order_number
        }]
      };
      let newData = req.body;
      Order.findOneAndUpdate(query, newData, {
        upsert: false
      }, function (err, doc) {
        if (err) return res.send(500, {
          error: err
        });
        return res.send("Updated Succesfully");
      });
    });

    // update the details of a specific order item
    router.put('/updateOrder/:order_number', function (req, res, next) {
      console.log(req.params.entity_id);
      // Find all data in the Order collection 
      var query = {
        'order_number': req.params.order_number
      };
      let newData = req.body;
      Order.findOneAndUpdate(query, newData, {
        upsert: false
      }, function (err, doc) {
        if (err) return res.send(500, {
          error: err
        });
        return res.send("Updated Succesfully");
      });
    });

    module.exports = router;
