var mongoose = require('mongoose');
var router = require('express').Router();
var Restaurant = mongoose.model('Restaurant');
var auth = require('../auth');
const request = require('request-promise');

// Look up associated Tax price
router.post('/lookup', function (req, res, next) {
  // Setting URL and headers for request
  var options = {
    url: 'https://api.taxcloud.com/1.0/TaxCloud/Lookup',
    json: true, 
    headers: {
      "Content-Type": "application/json",
        'User-Agent': 'request'
    },
    body: req.body
};
options.body["apiLoginId"] = process.env.TAX_API_LOGIN_ID || "2C1147D0"; //"12517BD0";
options.body["apiKey"] = process.env.TAX_API_KEY || "2EB2E89B-BE03-439C-80F5-60CB0BCACBC6"; //"E7C73BFD-A48E-42A1-899A-F18ED2A63D38";

// Return new promise 
return new Promise(function(resolve, reject) {
  // Do async job
    request.post(options, function(err, resp, body) {
        if (err) {
            reject(err);
        } else {
            //resolve(JSON.parse(body));
            return res.json(body);
        }
    })
})
});

module.exports = router;
