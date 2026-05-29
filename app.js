const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;
const path = require('path');

// 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));

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

app.get('/listings/:id', async (req, res) =>{
  const {id} = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/show.ejs', {listing});
})