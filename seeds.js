const mongoose = require('mongoose');
let Campground = require('./models/campground');
let Comment = require('./models/comment');

let data = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Granite Hill',
    image: 'https://images.freeimages.com/images/premium/previews/4993/49934380-delos-in-the-cyclades-greece.jpg',
    description: "Bacon ipsum dolor amet tenderloin pork chop meatloaf meatball picanha leberkas ball tip. Tail shankle short loin, salami ball tip spare ribs porchetta pancetta pork loin capicola fatback cupim drumstick. Alcatra short loin t-bone ham hock capicola. Leberkas meatball pancetta, pastrami jowl hamburger pork fatback turducken ham hock."
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Sand Storm',
    image: 'https://images.freeimages.com/images/premium/previews/9636/9636823-sea-view.jpg',
    description: 'Bacon ipsum dolor amet tenderloin pork chop meatloaf meatball picanha leberkas ball tip. Tail shankle short loin, salami ball tip spare ribs porchetta pancetta pork loin capicola fatback cupim drumstick. Alcatra short loin t-bone ham hock capicola. Leberkas meatball pancetta, pastrami jowl hamburger pork fatback turducken ham hock.'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Garden Ville',
    image: 'https://images.freeimages.com/images/premium/previews/4988/49887012-colorful-autumn-tree-in-forest.jpg',
    description: 'Bacon ipsum dolor amet tenderloin pork chop meatloaf meatball picanha leberkas ball tip. Tail shankle short loin, salami ball tip spare ribs porchetta pancetta pork loin capicola fatback cupim drumstick. Alcatra short loin t-bone ham hock capicola. Leberkas meatball pancetta, pastrami jowl hamburger pork fatback turducken ham hock.'
  }
];

function seedDB(){
  // Remove all existing campground
  Campground.remove({}, (err)=>{
    if (err) {
      console.log(err);
    } else {
      console.log('Removed campgrounds');
  //Insert few campground into the DB
      data.forEach((seed)=>{
        Campground.create(seed, (err, campground)=>{
          if (err) {
            console.log(err);
          } else {
            console.log('Added campground');
            Comment.create(
              {
                _id: new mongoose.Types.ObjectId(),
                text: 'This place is amazing guys!!!',
                author: 'Homer Simpson'
              }, (err, comment)=>{
              if (err) {
                console.log(err);
              } else {
                campground.comments.push(comment._id);
                campground.save((err)=>{
                console.log('Comment inserted!');
                });
              }
            });
          }
        });
      });
    }
  });


}
module.exports = seedDB;
