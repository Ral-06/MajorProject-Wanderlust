if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

// Routes
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

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

// Session configuration
const sessionConfig = {
  secret: 'mysupersecretcode',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expire: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true
  }
};

// // Root route;
// app.get('/', (req, res) => {
//   res.send('Hi, welcome to the Express server!');
// });
// //...

// Use session and flash middleware
app.use(session(sessionConfig));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user; // Make the current user available in all templates
  next();
});

// app.get('/demouser', async (req, res) => {
//   let fakeUser = new User({
//     email: 'student@gmail.com',
//     username: 'delta-student'
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });


// Use the routes
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);


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