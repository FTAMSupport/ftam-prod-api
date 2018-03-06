var mongoose = require('mongoose');
var router = require('express').Router();
var Menu = mongoose.model('Menu');
var User = mongoose.model('User');
var auth = require('../auth');
var acl = require('../../authorization').getAcl();

function get_user_id (req, res, next) {
   return req.payload.username;
 }

// return a list of menu items associated with a sepcific menuId
router.get('/getByMenuId/:menuId', function (req, res, next) {
  // Find all data in the Menu collection 
  Menu.find().where("menuId", req.params.menuId).exec(function (err, menu) {
    if (err) return console.error(err);
    return res.json(menu);
  });
}); 

// return a list of menu items for a given entity_id
router.get('/getByEntityId/:entityId', function (req, res, next) {
  Menu.find().where("entityId", req.params.entityId).exec(function (err, menu) {
    if (err) return console.error(err);
    return res.json(menu);
  });
});

// return a list of menu items for a given restaurant_id
router.get('/getByRestaurantId/:restaurantId', function (req, res, next) {
  Menu.find().where("restaurantId", req.params.restaurantId).exec(function (err, menu) {
    if (err) return console.error(err);
    return res.json(menu);
  });
});

// return a list of menu items for a given restaurant_id and entity_id
router.get('/getByEntityIdAndRestaurantId/:entityId/:restaurantId', function (req, res, next) {
  Menu.find({
      $and: [{
        "entityId": req.params.entityId
      }, {
        "restaurantId": req.params.restaurantId
      }]
    })
    .exec(function (err, menu) {
      if (err) return console.error(err);
      return res.json(menu);
    });
});

// post (behind auth)
/* router.post('/postMenuEntry', auth.required, acl.middleware(3, get_user_id, 'post'), function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401);
    }
    var menu = new Menu();
    menu.entityId = req.body.entityId;
    menu.restaurantId = req.body.restaurantId;
    menu.menuId = req.body.menuId;
    menu.category = req.body.category;
    menu.category.item = req.body.category.item;
    // call the built-in save method to save to the database
    menu.save().then(function () {
      console.log('Menu saved successfully!');
      return res.json({
        menu: menu.toPostJSON()
      });
    }).catch(next);
  });
}); */

// post (without auth)
router.post('/postMenuEntry', function (req, res, next) {
    var menu = new Menu();
    menu.entityId = req.body.entityId;
    menu.restaurantId = req.body.restaurantId;
    menu.menuId = req.body.menuId;
    menu.category = req.body.category;
    menu.category.item = req.body.category.item;
    // call the built-in save method to save to the database
    menu.save().then(function () {
      console.log('Menu saved successfully!');
      return res.json({
        menu: menu.toPostJSON()
      });
    }).catch(next);
  });

module.exports = router;
