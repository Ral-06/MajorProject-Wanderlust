const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

// Import Models
const Listing = require('./models/listing');

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

// Listen for incoming requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
//...

// Root route
app.get('/', (req, res) => {
  res.send('Hi, welcome to the Express server!');
});
//...

// Route to get all listings
app.get('/listings', async (req, res) => {
  const allListing = await Listing.find({});
  res.render('listings/index.ejs', {allListing});
});
//...

// Route to show form for creating a new listing
app.get('/listings/new', (req, res) => {
  res.render('listings/new.ejs');
});
//...

// Route to get a specific listing by ID
app.get('/listings/:id', async (req, res) =>{
  const {id} = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/show.ejs', {listing});
});
//...

// Route to handle form submission for creating a new listing
app.post('/listings', async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect('/listings');
});
//...

// Route to show form for editing a listing
app.get('/listings/:id/edit', async (req, res) => {
  const {id} = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', {listing});
});
//...

// Route to handle form submission for updating a listing
app.put('/listings/:id', async (req, res) => {
  const {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
});
//...

// Route to handle deletion of a listing
app.delete('/listings/:id', async (req, res) => {
  const {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
});