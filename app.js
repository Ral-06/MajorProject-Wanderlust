const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;

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