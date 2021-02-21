const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const Product = require('./models/product');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/shopApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Database connected!');
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/product/new', (req, res) => {
  res.render('new');
});

app.post('/product/new', async (req, res) => {
  const newProduct = Product(req.body);
  await newProduct.save();
  res.redirect('/');
});

app.get('/product/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render('show', { product });
});

app.get('/product/:id/edit', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  const categories = ['vegetable', 'fruit', 'dairy'];
  res.render('Edit', { product, categories });
});

app.get('/', async (req, res) => {
  const products = await Product.find({});
  res.render('home', { products });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
