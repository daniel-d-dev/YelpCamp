// **************************************************
// Module Imports and Setup
// **************************************************
const express = require('express');
router = express.Router({ mergeParams: true });

const { reviewSchema } = require('../schemas.js');

const Campground = require('../models/campground');
const Review = require('../models/review');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// **************************************************
// Middleware Setup
// **************************************************
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

// **************************************************
// Review Routes
// **************************************************

// Create Review Route (POST - Create)
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Delete Review Route (DELETE - Delete)
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

// **************************************************
// Module Export
// **************************************************
module.exports = router;