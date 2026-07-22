const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');
const Listing = require('../models/listing');

const listingController = require('../controllers/listings.js');

router.route('/')
    // Index Route - get all listings
    .get(wrapAsync(listingController.index))

    // Create Route - handle the creation of a new listing
    .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing)
);
    

// New Route - show form to create a new listing
router.get('/new', isLoggedIn, listingController.renderNewForm);


router.route('/:id')
    // Show Route - show details of a specific listing
    .get( wrapAsync(listingController.showListing))

    // Update Route
    .put( isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))

    // Destroy Route
    .delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)
);


// Edit Route - show form to edit a listing
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;