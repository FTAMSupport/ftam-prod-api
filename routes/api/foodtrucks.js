var mongoose = require('mongoose');
var router = require('express').Router();
var Foodtruck = mongoose.model('Foodtruck');
var auth = require('../auth');

// return list of all the registered foodtrucks
router.get('/getFoodtrucks', function (req, res, next) {
    // Find all data in the Foodtruck collection
    Foodtruck.find({}, function(err, foodtrucks) {
    if (err) return console.log(err);
    return res.json(foodtrucks);
    });
});

module.exports = router;