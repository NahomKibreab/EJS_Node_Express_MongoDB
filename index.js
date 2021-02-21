const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const Product = require('./models/product');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/shopApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Database connected!');
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

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

app.put('/product/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
  });
  res.redirect(`/product/${product._id}`);
});

app.delete('/product/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  res.redirect(`/`);
});

app.get('/', async (req, res) => {
  const products = await Product.find({});
  res.render('home', { products });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
