const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const Product = require('./models/product');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shopApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Database connected!');
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/product/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render('show', { product });
});

app.use('/', async (req, res) => {
  const products = await Product.find({});
  res.render('home', { products });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
