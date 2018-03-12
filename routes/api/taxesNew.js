var mongoose = require('mongoose');
var router = require('express').Router();
var Restaurant = mongoose.model('Restaurant');
var auth = require('../auth');
const request = require('request-promise');
var Avatax = require('avatax');
var config = require('../../config');

// resolve configuration and credentials 
const ava_config = {
  appName: 'ftam',
  appVersion: '1.0',
  environment: 'production',
  machineName: 'ftam-prod-api'
};

const creds = {
  username: config.tax_ava_login_id,
  password: config.tax_ava_password
};

var client = new Avatax(ava_config).withSecurity(creds);

// Look up associated Tax price
router.post('/lookup', function (req, res, next) {
  return client.createTransaction({
      model: req.body
    })
    .then(result => {
      // response tax document
      console.log(result);
      return res.json(result);
    });
});

module.exports = router;
