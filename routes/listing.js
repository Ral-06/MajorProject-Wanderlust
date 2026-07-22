const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');
const Listing = require('../models/listing');

const listingController = require('../controllers/listings.js');


// Index Route - get all listings
router.get('/', wrapAsync(listingController.index));
//...

// New Route - show form to create a new listing
router.get('/new', isLoggedIn, listingController.renderNewForm);
//...

// Show Route - show details of a specific listing
router.get('/:id', wrapAsync(listingController.showListing));
//...

// Create Route - handle the creation of a new listing
router.post('/', isLoggedIn, validateListing, wrapAsync(listingController.createListing));
//...

// Edit Route - show form to edit a listing
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
//...

// Update Route
router.put('/:id', isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));
//...

// Destroy Route
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;