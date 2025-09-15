const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true    // each user has only one favorites list
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
