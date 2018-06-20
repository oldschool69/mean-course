const express = require('express');

const router = express.Router();

const Post = require('../models/post');

router.post('', (req, res, next) => {

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

router.get('', (req, res, next) => {
  console.log('Second middleware');

  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Post fetched successfully!',
        posts: documents
      })
    });
});

router.get('/:id', (req, res, next) => {
  Post.findById({_id: req.params.id}).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found'});
    }
  });
});

router.put('/:id', (req, res, next) => {
  const post = {
    title: req.body.title,
    content: req.body.content
  };

  Post.updateOne({_id: req.params.id}, post).then((result) => {
    res.status(200).json({message: 'Update successful!'});
  }).catch(reason => {
    console.log('*** FROM SERVER: reason ', reason);
    res.status(500).json({reason});
  });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({message: "Post deleted!"});
  });
});

module.exports = router;

