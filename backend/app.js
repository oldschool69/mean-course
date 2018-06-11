const express = require('express');

const app = express();

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

app.use('/api/posts', (req, res, next) => {
  console.log('Second middleware');

  const posts = [
    {
      id: 'fweedfsfds',
      title: 'first server-side post',
      content: 'Firs post content'
    },
    {
      id: 'jfkjskfjkss',
      title: 'second server-side post',
      content: 'Second post content'
    },

  ];
  res.status(200).json({
    message: 'Post fetched successfully!',
    posts: posts
  })
});

module.exports = app;
