// models/Message.js
const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  edited: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  modifiedAt: { type: Date }
})

messageSchema.pre('save', function (next) {
  this.modifiedAt = Date.now()
  next()
})

const Message = mongoose.model('Message', messageSchema)
module.exports = Message
