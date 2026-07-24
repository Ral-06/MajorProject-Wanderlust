const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};

  const allListing = await Listing.find(filter);
  res.render('listings/index.ejs', { allListing, category });
};

module.exports.renderNewForm = (req, res) => {
  res.render('listings/new.ejs');
};

module.exports.showListing = async (req, res) =>{
  const {id} = req.params;
  const listing = await Listing.findById(id).populate({path: 'reviews', populate: {path: 'author'}}).populate('owner');
  if(!listing) {
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/listings');
  }
  res.render('listings/show.ejs', {listing});
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
  .send()

  if (!req.file) {
    req.flash('error', 'Please select an image for the listing.');
    return res.redirect('/listings/new');
  }
  let url = req.file.path || req.file.secure_url || req.file.url;
  let filename = req.file.filename || req.file.public_id;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename};

  newListing.geometry = response.body.features[0].geometry;

  await newListing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect('/listings');
};

module.exports.renderEditForm = async (req, res) => {
  const {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/listings');
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_300");
  res.render('listings/edit.ejs', {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
  const {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

  if(req.file) {
    let url = req.file.path || req.file.secure_url || req.file.url;
    let filename = req.file.filename || req.file.public_id;
    listing.image = {url, filename};
    await listing.save();
  }

  req.flash('success', 'Successfully updated the listing!');
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const {id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted the listing!');
  res.redirect('/listings');
};