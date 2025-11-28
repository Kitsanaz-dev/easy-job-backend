const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  detail: {
    budget: {
      type: Number,
      min: 0,
      require: true
    },
    type: {
      type: String,
      enum: [
        'full-time',
        'part-time',
        'contract',
        'internship'
      ],
      required: true
    },
    categories: {
      type: String,
      enum: [
        'Graphic Design',
        'Information Technology',
        'Architecture',
        'Marketing',
        'UX/UI Design',
        'Web Development',
        'Mobile App Development',
        'Content Creation',
        'Writing & Translation',
        'Data Science',
        'Machine Learning',
        'Cybersecurity',
        'Project Management',
        'Other',
      ],
      required: true
    }
  },
  description: {
    type: String,
    minlength: 10,
    maxlength: 5000
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true }); // Add timestamps (timestamps is true adds createdAt and updatedAt fields)

// Add index for better search performance
postSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Post', postSchema);