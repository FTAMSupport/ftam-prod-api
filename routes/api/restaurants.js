var mongoose = require('mongoose');
var router = require('express').Router();
var Restaurant = mongoose.model('Restaurant');
var auth = require('../auth');

// return a list of registered restaurants associated with a sepcific entity_id
router.get('/getByEntityId/:entityId', function (req, res, next) {
  Restaurant.find().where("entityId", req.params.entityId).exec(function (err, restaurant) {
    if (err) return console.error(err);
    return res.json(restaurant);
  });
});

// return a registered restaurant associated with a restaurant_Id
router.get('/getByRestaurantId/:restaurantId', function (req, res, next) {
  Restaurant.find().where("restaurantId", req.params.restaurantId).exec(function (err, restaurant) {
    if (err) return console.error(err);
    return res.json(restaurant); //res.json({restaurant: restaurant.toPostJSON()});
  });
});

// return list of all the registered restaurants
router.get('/getAllRestaurants', function (req, res, next) {
  // Find all data in the Restaurant collection
  Restaurant.find({}, function(err, restaurants) {
  if (err) return console.log(err);
  return res.json(restaurants);
  });
});

// return list of all the trusted vendor phone numbers from registered restaurants
router.get('/getAllPhoneNumbers/:phoneNumber', function (req, res, next) {
  // Find all Phonedata in the Restaurant collection
  Restaurant.find().where({"contact.phone": req.params.phoneNumber}).exec(function (err, restaurant) {
    if (err) return console.error(err);
    return res.json(restaurant);
    //if(restaurant.length !== 0){
    //  return res.send(200, "trusted");
    //}else{
    //  return res.send(403, "untrusted");
    //}
  });

  //toggle restaurant open/close flag
  router.put('/toggleFlag/:restaurantId/:status', function (req, res, next) {
      console.log(req.params.status);
      // Find all data in the Order collection 
      var query = {
        'restaurantId': req.params.restaurantId
      };
      let newData = {"disabled" : req.params.status};
      Restaurant.findOneAndUpdate(query, newData, {
        upsert: false
      }, function (err, doc) {
        if (err) return res.send(500, {
          error: err
        });
        return res.send(200,"Status Updated Succesfully");
      });
    });

/*   Restaurant.find({"contact": { $all : [req.params.phoneNumber] }}, function(err, restaurants) {
  if (err) return console.log(err);
  return res.json(restaurants);
  }); */
});

// post
router.post('/postRestaurantEntry', function (req, res, next) {
  var restaurant = new Restaurant();
  restaurant.entityId = req.body.entityId;
  restaurant.restaurantId = req.body.restaurantId;
  restaurant.name = req.body.name;
  restaurant.description = req.body.description;
  restaurant.phone = req.body.phone;
  restaurant.owner = req.body.owner;
  restaurant.intersection = req.body.intersection;
  restaurant.openDate = req.body.openDate;
  restaurant.disabled = req.body.disabled;
  restaurant.maxOrders = req.body.maxOrders;
  restaurant.address = req.body.address;
  restaurant.coordinates = req.body.coordinates;
  restaurant.onlineOrdering = req.body.onlineOrdering;
  restaurant.config = req.body.config;
  restaurant.dailyHours = req.body.dailyHours;
  restaurant.specialHours = req.body.specialHours;

  //restaurant.setPassword(req.body.user.password);

  // call the built-in save method to save to the database
  restaurant.save().then(function() {
    console.log('Restaurant item saved successfully!');
    return res.json({restaurant: restaurant.toPostJSON()});
  }).catch(next);
});

module.exports = router;
