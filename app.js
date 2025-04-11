// **************************************************
// Module Imports and Setup
// **************************************************
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

const Campground = require('./models/campground');
const Review = require('./models/review');

const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');

// **************************************************
// Database Connection
// **************************************************
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// **************************************************
// Express Application Setup
// **************************************************
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// **************************************************
// Middleware Setup
// **************************************************
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// **************************************************
// Route Mounting
// **************************************************
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)

// **************************************************
// Application Routes
// **************************************************
app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found.', 404))
});

// **************************************************
// Error Handler
// **************************************************
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!';
    res.status(statusCode).render('error', { err });
});

// **************************************************
// Server Start
// **************************************************
app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000!')
});