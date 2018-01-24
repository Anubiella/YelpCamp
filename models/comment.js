const mongoose = require('mongoose');

let commentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
});

module.exports = mongoose.model('Comment', commentSchema);
