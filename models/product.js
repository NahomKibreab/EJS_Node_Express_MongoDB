const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
  name: String,
  price: Number,
  category: {
    type: String,
    lowercase: true,
    enum: ['vegetable', 'fruit', 'dairy'],
  },
});

module.exports = mongoose.model('Product', productSchema);
