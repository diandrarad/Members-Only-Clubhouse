// populateDB.js

require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
const Message = require('./models/Message')

// Connect to the database
mongoose.connect(process.env.MONGO_URI)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"))

// Function to create users and messages
async function createSampleData() {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Message.deleteMany({})

    // Create users
    const users = [
      { firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', password: 'Password' },
      { firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com', password: 'Password' },
      { firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com', password: 'Password' }
    ];

    for (let userData of users) {
      const newUser = new User({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email
      })
      await User.register(newUser, userData.password)
    }

    // Fetch the created users
    const alice = await User.findOne({ email: 'alice@example.com' })
    const bob = await User.findOne({ email: 'bob@example.com' })
    const charlie = await User.findOne({ email: 'charlie@example.com' })

    // Create messages
    const messages = [
      { title: 'First Post', text: 'This is the first post by Alice.', author: alice._id },
      { title: 'Hello World', text: 'Bob says hello to the world.', author: bob._id },
      { title: 'Greetings', text: 'Charlie sends his greetings.', author: charlie._id }
    ];

    for (let messageData of messages) {
      const message = new Message({
        title: messageData.title,
        text: messageData.text,
        author: messageData.author
      })

      await message.save()
    }

    console.log('Sample data created successfully!')
  } catch (err) {
    console.error('Error creating sample data:', err)
  } finally {
    mongoose.connection.close()
  }
}

createSampleData()