var mongoose = require('mongoose');
var router = require('express').Router();
var Restaurant = mongoose.model('Restaurant');
var auth = require('../auth');
const request = require('request-promise');
var Avatax = require('avatax');
var tax_ava_login_id = require('../../config').tax_ava_login_id;
var tax_ava_password = require('../../config').tax_ava_password;

// resolve configuration and credentials 
const config = {
  appName: 'your-app',
  appVersion: '1.0',
  environment: 'sandbox',
  machineName: 'your-machine-name'
};

const creds = {
  username: tax_ava_login_id,
  password: tax_ava_password
};

var client = new Avatax(config).withSecurity(creds);

// Look up associated Tax price
router.post('/lookup', function (req, res, next) {
  return client.createTransaction({
      model: req.body
    })
    .then(result => {
      // response tax document
      console.log(result);
      return res.json(result);
    }).catch(function(e) {
      console.log(e); 
    })
});

module.exports = router;
