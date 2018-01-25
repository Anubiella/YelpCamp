const express = require('express');
let app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const methodOverride = require('method-override');
const localStrategy = require('passport-local');
const flash = require('connect-flash');


//EXTERNAL FILES REQUIRED
let campgroundsRoutes = require('./routes/campgrounds');
let commentsRoutes = require('./routes/comments');
let indexRoutes = require('./routes/index');
let seedDB = require('./seeds');
let Campground = require('./models/campground');
let Comment = require('./models/comment');
let User = require('./models/user');


////////////////////DB SECTION///////////////////////

let dbUrl = process.env.DATABASEURL|| 'mongodb://localhost/yelp_camp';
mongoose.connect(dbUrl);


//GENERAL APP SETUP
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(methodOverride('_method'));
app.use(flash());

/////////////PASSPORT CONFIGURATION/////////////////
app.use(require('express-session')({
  secret: 'Sempre caro mi fu quest ermo colle e questa siepe che',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(commentsRoutes);
app.use(campgroundsRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT||3000, ()=>{
  console.log('YelpCamp Server has started!!');
});
