const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect('mongodb+srv://oliveira:ZlyxJc3DVnB4WQip@cluster0-ravys.mongodb.net/mean-course?retryWrites=true')
  .then(() => {
    console.log('Connected to the database');
  }).catch((e) => {
    console.log('Connection failed: ', e.message);
  });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post('/api/posts', (req, res, next) => {

  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully!',
      postId: createdPost._id
    });
  });
});

app.get('/api/posts', (req, res, next) => {
  console.log('Second middleware');

  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Post fetched successfully!',
        posts: documents
      })
    });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({message: "Post deleted!"});
  });
});

module.exports = app;
