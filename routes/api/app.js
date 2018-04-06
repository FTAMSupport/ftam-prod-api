var mongoose = require('mongoose');
var router = require('express').Router();
var App = mongoose.model('App');
var auth = require('../auth');

// return App version info
router.get('/getAppInfo', function (req, res, next) {
    // Find all data in the Foodtruck collection
    App.find({}, function(err, app) {
    if (err) return console.log(err);
    return res.json(app);
    });
});

module.exports = router;