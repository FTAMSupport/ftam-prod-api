var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');

var RestaurantSchema = new mongoose.Schema({
  entityId: {
    type: mongoose.Schema.Types.Number,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z]+$/, 'is invalid'],
    index: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.Number,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z]+$/, 'is invalid'],
    index: true
  },
  name: String,
  description: String,
  phone: String,
  contact:[{phone: String}],
  owner: String,
  intersection: String,
  timeZone: String,
  openDate: String,
  disabled: Boolean,
  config: {
    sImage1: String,
    sImage2: String,
    sImage3: String,
    sText1: String,
    sText2: String,
    sText3: String,
    notesLimit: Number,
    guestName: String,
    maxOrders: Number
  },
  onlineOrdering: {
    enabled: Boolean,
    canPickup: Boolean,
    canPayOnline: Boolean,
    posSystem: Boolean
  },
  dailyHours:[ {
    dayOfWeek: Number,
    dayName: String,
    openTime: String,
    closeTime: String
  }],
  specialHours: [{
    date: String,
    description: String,
    notificationBegin: String,
    notificationEnd: String,
    openTime: String,
    closeTime: String,
    isClosed: Boolean
  }],
  address: [{
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String
  }],
  coordinates: {
    latitude: {
      type: mongoose.Schema.Types.Number
    },
    longitude: {
      type: mongoose.Schema.Types.Number
    }
  }
}, {
  timestamps: true
});

RestaurantSchema.methods.toPostJSON = function () {
  return {
    name: this.name,
    description: this.description,
    owner: this.owner,
    phone: this.phone,
    intersection: this.intersection,
    timeZone: this.timeZone,
    openDate: this.openDate,
    disabled: this.disabled,
    sImage1: this.sImage1,
    sImage2: this.sImage2,
    sImage3: this.sImage3,
    notesLimit: this.notesLimit,
    guestName: this.guestName,
    maxOrders: this.maxOrders,
    address: this.address,
    coordinates: this.coordinates,
    onlineOrdering: this.onlineOrdering,
    //specialHours: this.specialHours,
    //dailyHours: this.dailyHours,
    config: this.config
  };
};

RestaurantSchema.plugin(uniqueValidator, {message: 'is already taken'});

RestaurantSchema.pre('validate', function(next){
  if(!this.slug)  {
    //this.slugify();
  }
  next();
});

RestaurantSchema.methods.slugify = function() {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

RestaurantSchema.methods.updateFavoriteCount = function() {
  var article = this;

  return User.count({favorites: {$in: [article._id]}}).then(function(count){
    article.favoritesCount = count;

    return article.save();
  });
};

RestaurantSchema.methods.toJSONFor = function(user){
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user)
  };
};

mongoose.model('Restaurant', RestaurantSchema);
