var express = require('express');
var methodOverride = require('method-override');
var app = express();
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/rotten-potatoes');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/rotten-potatoes');

// add model to our view
// models are capitalized & singular
var Review = mongoose.model('Review', {
  title: String,
  movieTitle: String,
  description: String
});

app.use(methodOverride('_method'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true}));



// mock array of projects

/* will be using database from now on
var reviews = [
  { title: "incredible review" },
  { title: "better incredible review" },
  {title: "only the best review"},
];
*/

/*
app.get('/', function (req, res) {
  res.render('home', {msg: 'Hello World!'});
});
*/

//home page
app.get('/', function (req, res){
  Review.find(function(err, reviews){
    res.render('reviews-index', {reviews:reviews});
  });
});

//New review
app.get('/reviews/new', function (req, res) {
  res.render('reviews-new', {});
});

// Show
app.get('/reviews/:id', function (req, res) {
  Review.findById(req.params.id).exec(function (err, review) {
    res.render('reviews-show', {review: review});
  });
});

//create a review
app.post('/reviews', function (req, res) {
  Review.create(req.body, function(err, review) {
    console.log(review);

    res.redirect('/reviews/' + review._id);
  });
  // res.render('reviews-new', {})
});

// Edit
app.get('/reviews/:id/edit', function (req, res) {
  Review.findById(req.params.id, function (err, review){
    res.render('reviews-edit', {review: review});
  });
});

// Update
app.put('/reviews/:id', function (req, res){
  Review.findByIdAndUpdate(req.params.id, req.body, function(err, review){
    res.redirect('/reviews/' + review._id);
  });
});

// Delete

app.delete('/reviews/:id', function (req, res){
  Review.findByIdAndRemove(req.params.id, function (err) {
    res.redirect('/');
  });
});

app.listen(3000, function (){
  console.log('Portfolio App listening on port 3000!');
});
