const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');

// Import Models
const Listing = require('../models/listing');


// Index Route - get all listings
router.get('/', wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render('listings/index.ejs', {allListing});
}));
//...

// New Route - show form to create a new listing
router.get('/new', isLoggedIn, (req, res) => {
  res.render('listings/new.ejs');
});
//...

// Show Route - show details of a specific listing
router.get('/:id', wrapAsync(async (req, res) =>{
  const {id} = req.params;
  const listing = await Listing.findById(id).populate('reviews').populate('owner');
  if(!listing) {
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/listings');
  }
  res.render('listings/show.ejs', {listing});
}));
//...

// Create Route - handle the creation of a new listing
router.post('/', isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect('/listings');
}));
//...

// Edit Route - show form to edit a listing
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  const {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/listings');
  }
  res.render('listings/edit.ejs', {listing});
}));
//...

// Update Route
router.put('/:id', isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
  const {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  req.flash('success', 'Successfully updated the listing!');
  res.redirect(`/listings/${id}`);
}));
//...

// Delete Route
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  const {id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted the listing!');
  res.redirect('/listings');
}));


module.exports = router;