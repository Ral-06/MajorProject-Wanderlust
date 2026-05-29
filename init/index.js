const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing');

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

// Initialize the database with sample data
const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log('Data was initialized successfully!');
}
//...

// Call the database initialization function
initDB().then(() => {
    console.log('Database initialization complete');
}).catch(err => {
    console.error('Error initializing database:', err);
});
//...