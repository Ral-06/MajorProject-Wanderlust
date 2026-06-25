const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema} = require('./schema.js');

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

// Import Models
const Listing = require('./models/listing');
const Review = require('./models/review');

// MongoDB connection
const MONGO_URL = 'mongodb://localhost:27017/wanderlust';

main().then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}
//...

// Validation middleware for listing data
const validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);
  let errMsg = error.details.map(el => el.message).join(', ');
  if(error) {
    throw new ExpressError(400, errMsg);
  }
  else {
    next();
  }
}

// Root route
app.get('/', (req, res) => {
  res.send('Hi, welcome to the Express server!');
});
//...

// Index Route - get all listings
app.get('/listings', wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render('listings/index.ejs', {allListing});
}));
//...

// New Route - show form to create a new listing
app.get('/listings/new', (req, res) => {
  res.render('listings/new.ejs');
});
//...

// Show Route - show details of a specific listing
app.get('/listings/:id', wrapAsync(async (req, res) =>{
  const {id} = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/show.ejs', {listing});
}));
//...

// Create Route - handle the creation of a new listing
app.post('/listings', validateListing, wrapAsync(async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect('/listings');
}));
//...

// Edit Route - show form to edit a listing
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
  const {id} = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', {listing});
}));
//...

// Update Route - handle the update of a listing
app.put('/listings/:id', validateListing, wrapAsync(async (req, res) => {
  const {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
}));
//...

// Delete Route - handle the deletion of a listing
app.delete('/listings/:id', wrapAsync(async (req, res) => {
  const {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
}));

// Review Route - handle the creation of a review for a listing
app.post('/listings/:id/reviews', async(req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
});

// Catch-all route for handling 404 errors
app.use((req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'));  
});

// Error handling middleware
app.use((err, req, res, next) => {
  let{statusCode=500, message="Something went wrong!"} = err;
  res.status(statusCode).render('error.ejs', {message});
  // res.status(statusCode).send(message);
});

// Listen for incoming requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
//...