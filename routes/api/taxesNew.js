var mongoose = require('mongoose');
var router = require('express').Router();
var Restaurant = mongoose.model('Restaurant');
var auth = require('../auth');
const request = require('request-promise');
var Avatax = require ('avatax');

// resolve configuration and credentials 
const config = {
    appName: 'your-app',
    appVersion: '1.0',
    environment: 'sandbox',
    machineName: 'your-machine-name'
  };

  const creds = {
    username: process.env.TAX_AVA_LOGIN_ID,
    password: process.env.TAX_AVA_PASSWORD
  };
   
  var client = new Avatax(config).withSecurity(creds);

// Look up associated Tax price
router.post('/lookup', function (req, res, next) {

    const taxDocument = {
        type: 'SalesOrder',
        companyCode: 'REBORNTECHNOLOGYLLC',
        date: '2017-04-17',
        customerCode: 'ABC',
        addresses: {
          SingleLocation: {
            line1: '123 Main Street',
            city: 'Irvine',
            region: 'AR',
            country: 'US',
            postalCode: '72712'
          }
        },
        lines: [
          {
            number: '1',
            quantity: 1,
            amount: 100,
            taxCode: '722513',
            itemCode: 'Y0001',
            description: 'Yarn'
          }
        ]
      }

      return client.createTransaction({ model: req.body })
        .then(result => {
          // response tax document
          console.log(result);
          return res.json(result);
        });
});

module.exports = router;
