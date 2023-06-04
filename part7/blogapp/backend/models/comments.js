const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
  },
})

commentSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  },
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
