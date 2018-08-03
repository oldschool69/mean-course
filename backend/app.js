const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect('mongodb+srv://oliveira:'
  + process.env.MONGO_ATLAS_PW
  + '@cluster0-ravys.mongodb.net/test')
  .then(() => {
    console.log('Connected to the database');
  }).catch((e) => {
    console.log('Connection failed: ', e.message);
  });

// mongoose.connect('mongodb://localhost/postdb')
//   .then(() => {
//     console.log('Connected to the database');
//   }).catch((e) => {
//     console.log('Connection failed: ', e.message);
//   });


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
