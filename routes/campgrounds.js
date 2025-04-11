// **************************************************
// Module Imports and Setup
// **************************************************
const express = require('express');
router = express.Router();

const { campgroundSchema } = require('../schemas.js');

const Campground = require('../models/campground');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// **************************************************
// Middleware Setup
// **************************************************
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};
// **************************************************
// Campground Routes
// **************************************************

// Index Route (List All Campgrounds) (GET - Read)
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

// New Campground Form Route (GET - Create Form)
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

// Create Campground Route (POST - Create)
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Show Campground Route (Details) (GET - Read)
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', { campground });
}));

// Edit Campground Form Route (GET - Update Form)
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/edit', { campground })
}));

// Update Campground Route (PUT - Update)
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Delete Campground Route (DELETE - Delete)
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

// **************************************************
// Module Export
// **************************************************
module.exports = router;