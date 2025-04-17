const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// MongoDB Connection
mongoose.connect('mongodb://mytestdb/local_library', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware and Routes
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

const catalogRouter = require('./routes/catalog');
app.use('/catalog', catalogRouter);

// View Engine Setup
app.set('views', './views');
app.set('view engine', 'pug');

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Kareem Abdul (24250392)', message: 'Welcome to the Home Page' });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Static files middleware
app.use(express.static('public'));

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).render('error', { 
    title: 'Page Not Found',
    message: 'The page you requested could not be found.',
    error: { stack: '' }
  });
});

// General Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Server Error',
    message: 'Something went wrong on our end.',
    error: err
  });
});
