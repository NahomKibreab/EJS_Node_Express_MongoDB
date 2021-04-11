const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    lowercase: true,
    enum: ['vegetable', 'fruit', 'dairy'],
  },
});

module.exports = mongoose.model('Product', productSchema);
