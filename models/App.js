var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var AppSchema = new mongoose.Schema({
  appPackageName: {
    type: String,
    required: [true, "can't be blank"],
    index: true
  },
  appVersionNumber: {
    type: String,
    required: [true, "can't be blank"],
    index: true
  },
  appName: String,
  env: String,
  type: String
},
{
  timestamps: true
});

AppSchema.methods.toPostJSON = function () {
  return {
    appPackageName: this.appPackageName,
    appVersionNumber: this.appVersionNumber,
    appName: this.appName,
    env: this.env,
    type: this.type
  };
};

mongoose.model('App', AppSchema);
