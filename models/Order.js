var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var uniqueValidator = require('mongoose-unique-validator');
const AutoIncrement = require('mongoose-sequence')(mongoose);
var slug = require('slug');

var allowedStatus = ['pending', 'processing', 'inprocess', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed'];
var OrderSchema = new mongoose.Schema({
  entity_id: {
    type: mongoose.Schema.Types.Number,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z]+$/, 'is invalid'],
    index: true
  },
  restaurant_id: {
    type: mongoose.Schema.Types.Number,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z]+$/, 'is invalid'],
    index: true
  },
  parent_id: {
    type: mongoose.Schema.Types.Number,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z]+$/, 'is invalid'],
    index: true
  },
  order_number: {
    type: mongoose.Schema.Types.Number,
    required: [false, "can't be blank"],
    index: true
  },
  order_key: {
    type: mongoose.Schema.Types.String,
    required: [false, "can't be blank"],
    index: true
  },
  created_via: {
    type: mongoose.Schema.Types.String,
    required: [true, "can't be blank"],
    index: false
  },
  version: {
    type: mongoose.Schema.Types.String,
    required: [true, "can't be blank"],
    index: false
  },
  order_status: {
    type: mongoose.Schema.Types.String,
    required: [false, "can't be blank"],
    enum: allowedStatus,
    index: false
  },
  currency: {
    type: mongoose.Schema.Types.String,
    required: [true, "can't be blank"],
    index: false
  },
  date_created: {
    type: Date,
    default: Date.now
  },
  date_created_gmt: {
    type: Date,
    default: Date.now
  },
  date_modified: {
    type: Date,
    default: Date.now
  },
  date_modified_gmt: {
    type: Date,
    default: Date.now
  },
  discount_total: {
    type: mongoose.Schema.Types.String,
    required: [false, "can't be blank"],
    index: false
  },
  discount_tax: {
    type: mongoose.Schema.Types.String
  },
  shipping_total: {
    type: mongoose.Schema.Types.String,
    required: [false, "can't be blank"],
    index: false
  },
  shipping_tax: {
    type: mongoose.Schema.Types.String,
    required: [false, "can't be blank"],
    index: false
  },
  cart_tax: {
    type: mongoose.Schema.Types.String,
    required: [false, "can't be blank"],
    index: false
  },
  total: {
    type: mongoose.Schema.Types.String,
    required: [true, "can't be blank"],
    index: false
  },
  total_tax: {
    type: mongoose.Schema.Types.String,
    required: [true, "can't be blank"],
    index: true
  },
  prices_include_tax: Boolean,
  customer_id: {
    type: mongoose.Schema.Types.Number,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z]+$/, 'is invalid'],
    index: false
  },
  customer_phone_no: {
    type: mongoose.Schema.Types.String,
    required: [false, "can't be blank"],
    index: false
  },
  customer_ip_address: {
    type: mongoose.Schema.Types.String,
    required: [false, "can't be blank"],
    index: false
  },
  customer_user_agent: {
    type: mongoose.Schema.Types.String,
    required: [false, "can't be blank"],
    index: false
  },
  customer_note: {
    type: mongoose.Schema.Types.String,
    required: [false, "can't be blank"],
    index: false
  },
  billing: {
    first_name: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    last_name: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    company: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    address_1: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    address_2: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    city: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    state: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    postcode: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    country: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    email: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    phone: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    }
  },
  shipping: {
    first_name: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    last_name: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    company: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    address_1: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    address_2: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    city: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    state: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    postcode: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    country: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    }
  },
  payment_method: {
    type: mongoose.Schema.Types.String,
    required: [false, "can't be blank"],
    index: false
  },
  payment_method_title: {
    type: mongoose.Schema.Types.String,
    required: [false, "can't be blank"],
    index: false
  },
  transaction_id: {
    type: mongoose.Schema.Types.String,
    required: [false, "can't be blank"],
    index: false
  },
  charge_id: {
    type: mongoose.Schema.Types.String,
    required: [false, "can't be blank"],
    index: false
  },
  date_paid: {
    type: Date,
    default: Date.now
  },
  date_paid_gmt: {
    type: Date,
    default: Date.now
  },
  date_completed: {
    type: Date,
    default: Date.now
  },
  date_completed_gmt: {
    type: Date,
    default: Date.now
  },
  cart_hash: {
    type: mongoose.Schema.Types.String,
    required: [false, "can't be blank"],
    index: false
  },
  meta_data: [{
    id: {
      type: mongoose.Schema.Types.Number,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z]+$/, 'is invalid'],
      index: true
    },
    key: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    value: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
  }],
  line_items: [{
    id: {
      type: mongoose.Schema.Types.Number,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z]+$/, 'is invalid'],
      index: true
    },
    name: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    product_id: {
      type: mongoose.Schema.Types.Number,
      required: [false, "can't be blank"],
      match: [/^[a-zA-Z]+$/, 'is invalid'],
      index: false
    },
    quantity: {
      type: mongoose.Schema.Types.Number,
      required: [false, "can't be blank"],
      match: [/^[a-zA-Z]+$/, 'is invalid'],
      index: false
    },
    tax_class: {
      type: mongoose.Schema.Types.Number,
      required: [false, "can't be blank"],
      match: [/^[a-zA-Z]+$/, 'is invalid'],
      index: false
    },
    subtotal: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    subtotal_tax: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    total: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    total_tax: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    notes: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    sku: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    price: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    }
  }],
  tax_lines: [{
    id: {
      type: mongoose.Schema.Types.Number,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z]+$/, 'is invalid'],
      index: true
    },
    rate_code: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    rate_id: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    label: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    compound: Boolean,
    tax_total: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    shipping_tax_total: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    meta_data: [{}]
  }],
  shipping_lines: [{
    id: {
      type: mongoose.Schema.Types.Number,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z]+$/, 'is invalid'],
      index: true
    },
    method_title: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    method_id: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    total: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    tax_total: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    taxes: [{}],
    meta_data: [{}]
  }],
  fee_lines: [{
    id: {
      type: mongoose.Schema.Types.Number,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z]+$/, 'is invalid'],
      index: true
    },
    name: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    tax_calss: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    tax_status: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    total: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    tax_total: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    taxes: [{}],
    meta_data: [{}]
  }],
  coupon_lines: [{
    id: {
      type: mongoose.Schema.Types.Number,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z]+$/, 'is invalid'],
      index: true
    },
    code: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    discount: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    discount_tax: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    meta_data: [{}]
  }],
  refunds: [{
    id: {
      type: mongoose.Schema.Types.Number,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z]+$/, 'is invalid'],
      index: true
    },
    reason: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    },
    total: {
      type: mongoose.Schema.Types.String,
      required: [false, "can't be blank"],
      index: false
    }
  }],
  set_piad: Boolean
}, {
  timestamps: true
});
OrderSchema.plugin(AutoIncrement, {inc_field: 'order_number'});

OrderSchema.methods.toPostJSON = function () {
  return {
    order_number: this.order_number,
    order_status: this.order_status,
    total: this.total,
    customer_phone_no: this.customer_phone_no,
    line_items: this.line_items
  };
};

mongoose.model('Order', OrderSchema);
