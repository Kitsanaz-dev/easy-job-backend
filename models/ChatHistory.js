const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
    default: 'global',
    index: true
  },
  roomType: {
    type: String,
    enum: ['global', 'direct'],
    default: 'global'
  },
  messages: [
    {
      sender: {
        type: String,
        required: true
      },
      senderId: {
        type: String
      },
      content: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
