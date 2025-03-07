// Module Imports and Setup
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

// Database Connection
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// Express Application Setup
const app = express();

// Set View Engine and Views Directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware Setup
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Routes
// Home Route (Read)
app.get('/', (req, res) => {
    res.render('home');
});

// Index Route (List All Campgrounds) (Read)
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

// New Campground Form Route (Create)
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// Create Campground Route (POST) (Create)
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

// Show Campground Route (Details) (Read)
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
});

// Edit Campground Form Route (Update)
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
});

// Update Campground Route (PUT) (Update)
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
});

// Delete Campground Route (DELETE) (Delete)
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

// Server Start
app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000!')
});
