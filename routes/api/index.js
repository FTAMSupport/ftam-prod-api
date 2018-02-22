var router = require('express').Router();

router.use('/restaurant', require('./restaurants'));
router.use('/menu', require('./menus'));
router.use('/foodtrucks', require('./foodtrucks'));
router.use('/tax', require('./taxesNew'));
router.use('/order', require('./orders'));
router.use('/pay', require('./payment'));
router.use('/sms', require('./sms'));
router.use('/stripePay', require('./stripePayment'));
router.use('/payold', require('./paymentold'));
router.use('/', require('./users'));


router.use(function(err, req, res, next){
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;
        return errors;
      }, {})
    });
  }
  return next(err);
});

module.exports = router;