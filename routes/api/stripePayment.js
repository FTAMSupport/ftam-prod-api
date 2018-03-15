'use strict';
var router = require('express').Router();
var config = require('../../config');
var stripe = require('stripe')(config.stripe_secret_key);

// post Stripe payment transaction
router.post('/', function (request, response) {
  var stripeToken = request.body.stripeToken;
  var amountpayable = request.body.amount;
  var metadata = request.body.metadata;
  var receipt_email = request.body.metadata.stripeEmail;
  var charge = stripe.charges.create({
    amount: amountpayable,
    source: stripeToken,
    metadata: metadata,
    currency: 'USD',
    description: 'Strie Payment Transaction from nodeApi',
    receipt_email: receipt_email
  }, function (err, charge) {
    if (err) {
      console.log(err);
      switch (err.type) {
        case 'StripeCardError':
          // A declined card error
         response.json(err); // => e.g. "Your card's expiration year is invalid."
          break;
        case 'RateLimitError':
          // Too many requests made to the API too quickly
          response.json(err);
          break;
        case 'StripeInvalidRequestError':
          // Invalid parameters were supplied to Stripe's API
          response.json(err);
          break;
        case 'StripeAPIError':
          // An error occurred internally with Stripe's API
          response.json(err);
          break;
        case 'StripeConnectionError':
          // Some kind of error occurred during the HTTPS communication
          response.json(err);
          break;
        case 'StripeAuthenticationError':
          // You probably used an incorrect API key
          response.json(err);
          break;
        default:
          // Handle any other types of unexpected errors
          response.json("unknown error");
          break;
      }
    } else
      return response.json(charge);
  })
})

module.exports = router;
