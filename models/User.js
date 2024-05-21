// models/User.js

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
  isMember: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
})

// userSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     const salt = await bcrypt.genSalt(10)
//     this.password = await bcrypt.hash(this.password, salt)
//   }
//   next()
// })

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

const User = mongoose.model('User', userSchema)
module.exports = User