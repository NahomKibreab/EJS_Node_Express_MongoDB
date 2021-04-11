const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const Product = require('./models/product');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const AppError = require('./AppError');

mongoose.connect('mongodb://localhost/farmShop2', {
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

app.get('/product', async (req, res, next) => {
  try {
    const { category } = req.query;
    if (category) {
      const products = await Product.find({ category });
      res.render('home', { products, category });
    } else {
      const products = await Product.find({});
      res.render('home', { products, category });
    }
  } catch (error) {
    next(error);
  }
});
app.get('/product/new', (req, res, next) => {
  try {
    res.render('New');
  } catch (error) {
    next(error);
  }
});

app.post('/product/new', async (req, res, next) => {
  try {
    const newProduct = Product(req.body);
    await newProduct.save();
    res.redirect('/product');
  } catch (error) {
    next(error);
  }
});

app.get('/product/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (product) {
      res.render('show', { product });
    } else {
      throw new AppError(404, 'Page not found');
    }
  } catch (error) {
    next(error);
  }
});

app.get('/product/:id/edit', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    const categories = ['vegetable', 'fruit', 'dairy'];
    res.render('Edit', { product, categories });
  } catch (error) {
    next(error);
  }
});

app.put('/product/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
    });
    res.redirect(`/product/${product._id}`);
  } catch (error) {
    next(error);
  }
});

app.delete('/product/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.redirect(`product`);
  } catch (error) {
    next(next);
  }
});

app.get('/category/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.redirect(`/`);
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Something went wrong' } = err;
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
