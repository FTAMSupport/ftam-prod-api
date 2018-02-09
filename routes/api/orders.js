var mongoose = require('mongoose');
var router = require('express').Router();
var Order = mongoose.model('Order');
var pay = require('./payment');
const request = require('request-promise');
const uuid = require('uuid4');
var auth = require('../auth');
var acl = require('../../authorization').getAcl();

function get_user_id (req, res, next) {
  return req.payload.username;
}

// Create new Order
router.post('/', function (req, res, next) {
  let order = new Order(req.body.order);
  let payment = req.body.payment;
  console.log("payment info" + payment);
  // PP -> Authorize and Charge - OLD
  // PP -> Create an Accept Payment Transaction - NEW
  var api_uri = require('../../config').api_uri + "/api/stripePay";
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
      // Built-in save method to save to order details to the Database
      order.save().then(function () {
        console.log('Order saved successfully!');
        return res.json({
          order: order.toPostJSON()
        });
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
  Order.find({ $and: [{"entity_id": req.params.entity_id}, {"restaurant_id": req.params.restaurant_id}] })
   .exec(function (err, orders) {
     if (err) return console.error(err);
     return res.json(orders);
   });
 });

 // return a list of order items associated with a sepcific Entity_Id
router.get('/getByEntityIdAndOrderStatus/:entity_id', function (req, res, next) {
  console.log(req.params.entity_id);
  // Find all data in the Order collection 
  Order.find({order_status: req.query.order_status}).where("entity_id", req.params.entity_id).exec(function (err, orders) {
    if (err) return console.error(err);
    return res.json(orders);
  });
});

// return a list of order items associated with a sepcific Restaurnat_Id
router.get('/getByRestaurantIdAndOrderStatus/:restaurant_id', function (req, res, next) {
  console.log(req.params.restaurant_id);
  // Find all data in the Order collection 
  Order.find({order_status: req.query.order_status}).where("restaurant_id", req.params.restaurant_id).exec(function (err, orders) {
    if (err) return console.error(err);
    return res.json(orders);
  });
});

// return a list of order items associated with a sepcific restaurant_id and entity_id
router.get('/getByEntityIdAndRestaurantIdAndOrderStatus/:entity_id/:restaurant_id', function (req, res, next) {
  console.log(req.params.entity_id);
  console.log(req.params.restaurant_id);
  Order.find({ $and: [{"entity_id": req.params.entity_id}, {"restaurant_id": req.params.restaurant_id}, {"order_status": req.query.order_status}] })
   .exec(function (err, orders) {
     if (err) return console.error(err);
     return res.json(orders);
   });
 });

 // return a list of order items associated with a sepcific restaurant_id and entity_id
router.get('/getByOrderStatus', auth.required, function (req, res, next) {
  console.log(req.params.entity_id);
  console.log(req.params.restaurant_id);
  Order.find({ $and: [{"entity_id": req.payload.entityId}, {"restaurant_id": req.payload.restaurantId}, {"order_status": req.query.order_status}] })
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
  let query = { $and: [{"entity_id": req.params.entity_id}, {"restaurant_id": req.params.restaurant_id}, {'order_number': req.params.order_number}] };
  let newData = req.body;
  Order.findOneAndUpdate(query, newData, {upsert: false}, function (err, doc) {
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
  var query = {'order_number': req.params.order_number};
  let newData = req.body;
  Order.findOneAndUpdate(query, newData, {upsert: false}, function (err, doc) {
    if (err) return res.send(500, {
      error: err
    });
    return res.send("Updated Succesfully");
  });
});

module.exports = router;
