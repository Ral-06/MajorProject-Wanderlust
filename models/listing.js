const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        // required: true
    },
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            set: (v) => v === "" ? "https://pin.it/7ITQA8dZc" : v,
            default: "https://pin.it/7ITQA8dZc"
        }
    },
    price: {
        type: Number,
        // required: true
    },
    location: {
        type: String,
        // required: true
    },
    country: {
        type: String,
        // required: true
    },
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;