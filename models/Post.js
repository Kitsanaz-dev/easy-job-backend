const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: [
    {
      type: String
    }
  ],
  likeCount: {
    type: Number,
    default: 0
  },
  // favID: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Favorite'
  // }
}, { timestamps: true });

// Add index for better search performance
postSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Post', postSchema);