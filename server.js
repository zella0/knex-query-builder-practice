// setup knex to connect with our SQL server (postgres)
const env = 'development';
const config = require('./knexfile.js')[env];
const knex = require('knex')(config);

// setup express for easier navigation via HTTP requests
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8000;

const app = express();
app.use(bodyParser.json());


// - As a user, when I make a GET request to `/authors` I should get back an array of all authors.
app.get('/authors', function (req, res){
  knex.select('id', 'name', 'age', 'email', 'password')
  .from('Authors').
  then(function (result){
    res.json(result);
  })
  .catch((err)=>{
    console.log(err);
  })
})


// - As a user, when I make a GET request to `/articles` I should get back an array of all articles.
app.get('/articles', function (req, res){
  knex.select('id', 'content', 'author_id')
  .from('Articles')
  .then(function (result){
    res.json(result);
  })
  .catch((err)=>{
    console.log(err);
  })
})

// - As a user, when I make a POST request to `/authors` and pass JSON data it should create a new author based off of the data.
app.post('/authors', function (req, res){
  knex('Authors')
  .insert({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    password: req.body.password
  })
  .then(function (result){
    res.sendStatus(200);
  })
  .catch((err)=>{
    console.log(err);
  })
})

// - As a user, when I make a POST request to `/articles` and pass JSON data it should create a new article based off of the data.
app.post('/articles', function (req, res){
  knex('Articles')
  .insert({
    content: req.body.content,
    author_id: req.body.author_id
  })
  .then(function (result){
    res.sendStatus(200);
  })
  .catch((err)=>{
    console.log(err);
  })
})

// - As a user, when I make a GET request to `/authors/:id` I should get back the author along with all the articles that they have written.
app.get('/authors/:id', function (req, res){
  knex.select('Authors.name', 'Articles.id', 'Articles.content')
  .from('Authors')
  .join('Articles', 'Articles.author_id', '=', 'Authors.id')
  .where('Articles.author_id', req.params.id)
  .then(function (result){
    let authorObj = {
      [result[0].name]: []
    }
    result.map((item)=> {
      authorObj[item.name].push({[`postID ${item.id}`]: item.content});
    })
    res.json(authorObj);
  })
})

// - As a user, when I make a GET request to `/articles/:id` I should get back the article along with the name of the author who wrote the article.
app.get('/articles/:id', function (req, res){
  knex.select('Articles.id', 'content', 'Authors.name')
  .from('Articles')
  .join('Authors', 'Authors.id', '=', 'Articles.author_id')
  .where('Articles.id', req.params.id)
  .then(function (result){
    res.json(result);
  })
  .catch((err)=>{
    console.log(err);
  })
})

app.listen(port, function(){
  console.log('server is up on port ' + port)
})
