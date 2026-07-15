const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema} = require('../schema.js');

// Import Models
const Listing = require('../models/listing');


// Validation middleware for listing data
const validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);
  if(error) {
    let errMsg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(400, errMsg);
  }
  else {
    next();
  }
}

// Index Route - get all listings
router.get('/', wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render('listings/index.ejs', {allListing});
}));
//...

// New Route - show form to create a new listing
router.get('/new', (req, res) => {
  res.render('listings/new.ejs');
});
//...

// Show Route - show details of a specific listing
router.get('/:id', wrapAsync(async (req, res) =>{
  const {id} = req.params;
  const listing = await Listing.findById(id).populate('reviews');
  res.render('listings/show.ejs', {listing});
}));
//...

// Create Route - handle the creation of a new listing
router.post('/', validateListing, wrapAsync(async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect('/listings');
}));
//...

// Edit Route - show form to edit a listing
router.get('/:id/edit', wrapAsync(async (req, res) => {
  const {id} = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', {listing});
}));
//...

// Update Route
router.put('/:id', validateListing, wrapAsync(async (req, res) => {
  const {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  req.flash('success', 'Successfully updated the listing!');
  res.redirect(`/listings/${id}`);
}));
//...

// Delete Route
router.delete('/:id', wrapAsync(async (req, res) => {
  const {id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted the listing!');
  res.redirect('/listings');
}));


module.exports = router;