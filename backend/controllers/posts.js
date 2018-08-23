
const Post = require('../models/post');

const Rx = require('rxjs');
const {concatMap, flatMap, map, take, toArray, filter, tap} = require('rxjs/operators');
const fs = require('fs');

exports.createPost = (req, res, next) => {

  const url = req.protocol + '://' + req.get('host');

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully!',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Creating a post failed!'
    });
  });
};

exports.getPosts = (req, res, next) => {

  playingWithObserver();

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if(pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery.find()
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Post fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
      })
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fecthing posts failed'
      });
    });
};

playingWithObserver = () => {

  // const students1 = [
  //   {id: 1, name: "Carlos", age: 15},
  //   {id: 2, name: "Jose", age: 13},
  //   {id: 3, name: "Maria", age: 12},
  // ];

  // const students2 = [
  //   {id: 4, name: "Jonas", age: 15},
  //   {id: 5, name: "Mané", age: 13},
  //   {id: 6, name: "Hendrix", age: 12},
  // ];

  // const classes = [
  //   {
  //     id: 1,
  //     description: "Geography",
  //     students: students1,
  //   },
  //   {
  //     id: 2,
  //     description: "Math",
  //     students: students2,
  //   },
  // ];

  const classes = JSON.parse(
    fs.readFileSync('C:\\Users\\flavi\\Documents\\mean\\mean-course\\backend\\mocks\\classes.json'));

  console.log('***classes: ', classes);

  const obs$ = Rx.of(classes);


  obs$
    .pipe(
      tap(classes => console.log("***Step 1:\n", classes)),
      flatMap(classes => classes),
      // take(1),
      tap(_class => console.log("***Step 2:\n", _class)),
      map(_class => _class.students),
      tap(students => console.log("***Step 3:\n", students)),
      flatMap(student => student),
      // take(1),
      tap(student => console.log("***Step 4:\n", student)),
      map(student => student.name),
      //take(3),
      //filter(name => name === "Carlos"),
      toArray()

    )
    .subscribe(names => console.log(names));



}


exports.getPostById = (req, res, next) => {
  Post.findById({_id: req.params.id}).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fecthing posts failed'
    });
  });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;

  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }

  const post = {
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  };

  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then((result) => {
    if (result.n > 0) {
      res.status(200).json({message: 'Update successful!'});
    } else {
      res.status(401).json({message: 'Not authorized!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Could not update post!'
    });
  });
};


exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if (result.n > 0) {
      res.status(200).json({message: 'Post deleted!'});
    } else {
      res.status(401).json({message: 'Not authorized!'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Delete post failed'
    });
  });
};
