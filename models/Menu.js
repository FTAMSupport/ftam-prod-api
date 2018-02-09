var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');

var MenuSchema = new mongoose.Schema({
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
  menuId: {
    type: mongoose.Schema.Types.Number,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z]+$/, 'is invalid'],
    index: true
  },
  category: [{
    categoryId: Number,
    categoryName: String,
    categoryDescription: String,
    item: [{
      itemId: {
        type: mongoose.Schema.Types.Number,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z]+$/, 'is invalid'],
        index: true
      },
      itemName: String,
      itemDescription: String,
      itemImage: String,
      itemPrice: Number,
      itemCalories: Number,
      ingredients: [{
        ingredientId: {
            type: mongoose.Schema.Types.Number,
            required: [true, "can't be blank"],
            match: [/^[a-zA-Z]+$/, 'is invalid'],
            index: true
          },
        ingredientName: String,
        ingredientDescription: String,
        ingredientImage: String,
        ingredientCustomizable: Boolean
      }],
      step: [{
      stepId: Number,
        stepText: String,
        stepRequired: Boolean,
        stepMaxoptions: Number,
        options: [{
            optionId: {
                type: mongoose.Schema.Types.Number,
                required: [true, "can't be blank"],
                match: [/^[a-zA-Z]+$/, 'is invalid'],
                index: true
              },
          optionText: String,
          optionAdditionalPrice: Number
        }]
      }]
    }],
  }]
}, {
  timestamps: true
});

MenuSchema.methods.toPostJSON = function () {
  return {
    menuId: this.menuId
  };
};

mongoose.model('Menu', MenuSchema);
