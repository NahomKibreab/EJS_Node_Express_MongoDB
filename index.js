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

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((error) => next(error));
  };
}

app.get(
  '/product',
  wrapAsync(async (req, res, next) => {
    const { category } = req.query;
    if (category) {
      const products = await Product.find({ category });
      res.render('home', { products, category });
    } else {
      const products = await Product.find({});
      res.render('home', { products, category });
    }
  })
);
app.get(
  '/product/new',
  wrapAsync((req, res, next) => {
    res.render('New');
  })
);

app.post(
  '/product/new',
  wrapAsync(async (req, res, next) => {
    const newProduct = Product(req.body);
    await newProduct.save();
    res.redirect('/product');
  })
);

app.get(
  '/product/:id',
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      throw new AppError(404, 'Page not found');
    }
    res.render('show', { product });
  })
);

app.get(
  '/product/:id/edit',
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    const categories = ['vegetable', 'fruit', 'dairy'];
    res.render('Edit', { product, categories });
  })
);

app.put(
  '/product/:id',
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
    });
    res.redirect(`/product/${product._id}`);
  })
);

app.delete(
  '/product/:id',
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.redirect(`product`);
  })
);

app.get(
  '/category/:id',
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.redirect(`/`);
  })
);

const validationError = (e) => {
  console.dir(e);
  return new AppError(400, `This is Mongoose Validation Failed...${e.message}`);
};

app.use((err, req, res, next) => {
  console.log(err.name);
  if (err.name === 'ValidationError') {
    err = validationError(err);
  }

  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Something went wrong' } = err;
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
