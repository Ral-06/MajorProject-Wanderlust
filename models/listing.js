const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://pin.it/7ITQA8dZc",
        set: (v) => v === "" ? "https://pin.it/7ITQA8dZc" : v,
        // set: (v) => v === "" ? "https://pin.it/7KreYFjJV" : v,
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;