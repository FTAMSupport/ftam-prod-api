var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var AppSchema = new mongoose.Schema({
  appPackageName: {
    type: mongoose.Schema.Types.Number,
    required: [true, "can't be blank"],
    index: true
  },
  appVersionNumber: {
    type: mongoose.Schema.Types.Number,
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
    appName: this.appName
  };
};

mongoose.model('App', AppSchema);
