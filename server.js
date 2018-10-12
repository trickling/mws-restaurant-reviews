const express = require('express');
const path = require('path');
const app = express();
var http = require('http');
var url = require('url');
var querystring = require('querystring');


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/'));
app.get('/restaurant?', function (req, res) {
  var params = querystring.parse(url.parse(req.url).query);
  // res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.render('restaurant.ejs', {id: req.params.id})
});
app.get('/reviewupdate', function(req, res) {
  // res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.render('reviewupdate.ejs');
});
app.get('/review', function(req, res) {
  // res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.render('review.ejs');
});
app.get('/', function(req, res) {
  // res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.render('index.ejs');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
