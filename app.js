const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;

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

app.get('/testlisting', async (req, res) => {
  let sampleListing = new Listing({
    title: 'New Villa in Sri Ganganagar',
    description: 'This is a sample listing for testing purposes.',
    price: 100,
    location: 'Sri Ganganagar, Rajasthan',
    country: 'India'
  });
  await sampleListing.save();
  console.log('Sample listing saved to database');
  res.send('Sample listing created and saved to database!');
});