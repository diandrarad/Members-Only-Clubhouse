// routes/index.js
const express = require('express')
const router = express.Router()
const { body, check, validationResult } = require('express-validator')
const passport = require('passport')
const User = require('../models/User')
const Message = require('../models/Message')

// Sign-up route
router.get('/signup', (req, res) => {
  res.render('signup', { title:'Sign Up', errors: [] })
})

router.post('/signup', [
  check('firstName').notEmpty().withMessage('First Name is required'),
  check('lastName').notEmpty().withMessage('Last Name is required'),
  check('email').isEmail().withMessage('Email is invalid'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match')
    return true
  })
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.render('signup', { errors: errors.array() })

  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.render('signup', { errors: [{ msg: 'Email is already in use' }] })
    }

    const newUser = new User({ firstName, lastName, email })
    await User.register(newUser, password)

    req.flash('success', 'You are now registered and can log in')
    res.redirect('/login')
  } catch (err) {
    console.error(err)
    res.render('signup', { errors: [{ msg: 'An error occurred. Please try again.' }] })
  }
})

// Login route
router.get('/login', (req, res) => {
  res.render('login', { title:'Login' })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}))

// Membership route
router.get('/join', (req, res) => {
  res.render('join', { title:'Join the Club', errors: [] })
})

router.post('/join', [
  body('passcode').custom(value => {
    if (value !== process.env.MEMBER_PASSCODE) {
      throw new Error('Incorrect passcode')
    }
    return true
  })
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render('join', { errors: errors.array() })
  }

  req.user.isMember = true
  await req.user.save()
  req.flash('success', 'You are now a member')
  res.redirect('/')
})

// Admin route
router.get('/admin', (req, res) => {
  res.render('admin', { title:'Admin Access', errors: [] })
})

router.post('/admin', [
  body('passcode').custom(value => {
    if (value !== process.env.ADMIN_PASSCODE) {
      throw new Error('Incorrect passcode')
    }
    return true
  })
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render('admin', { errors: errors.array() })
  }

  req.user.isAdmin = true
  await req.user.save()
  req.flash('success', 'You are now an admin')
  res.redirect('/')
})

// Create message route
router.get('/new-message', (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in to create a message')
    return res.redirect('/login')
  }
  res.render('new-message', { title:'Create a New Message', errors: [] })
})

router.post('/new-message', [
  body('title').trim().isLength({ min: 1 }).escape().withMessage('Title required'),
  body('text').trim().isLength({ min: 1 }).escape().withMessage('Text required'),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render('new-message', { title:'Create a New Message', errors: errors.array() })
  }

  const { title, text } = req.body;
  const message = new Message({ title, text, author: req.user._id })
  await message.save()
  req.flash('success', 'Message created')
  res.redirect('/')
})

// Edit message route
router.post('/edit-message/:id', [
  body('title').trim().isLength({ min: 1 }).escape().withMessage('Title required'),
  body('text').trim().isLength({ min: 1 }).escape().withMessage('Text required'),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render('edit-message', { title: 'Edit Message', errors: errors.array() })
  }

  if (!req.user.isAdmin) {
    res.redirect('/')
    return req.flash('error', 'Unauthorized action')
  }

  try {
    const { title, text } = req.body;
    const updatedMessage = await Message.findByIdAndUpdate(req.params.id, {
      title, text, edited:true
    }, { new: true })

    if (!updatedMessage) {
      req.flash('error', 'Message not found')
      return res.status(404).redirect('/')
    }

    req.flash('success', 'Message updated')
  } catch (err) {
    req.flash('error', 'Error updating message')
  }

  res.redirect('/')
})

router.get('/edit/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in to create a message')
    return res.redirect('/login')
  }
  const message = await Message.findById(req.params.id)
  res.render('edit-message', { title:'Edit a Message', message, errors: [] })
})

// Home route
router.get('/', async (req, res) => {
  const messages = await Message.find().populate('author', 'firstName lastName')
  res.render('index', { title:'Messages', messages })
})

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err)
    req.flash('success', 'You are logged out')
    res.redirect('/')
  })
})

// Delete message route
router.post('/delete-message/:id', async (req, res) => {
  if (!req.user.isAdmin) {
    req.flash('error', 'Unauthorized action')
    return res.redirect('/')
  }

  try {
    await Message.findByIdAndDelete(req.params.id)
    req.flash('success', 'Message deleted')
  } catch (err) {
    req.flash('error', 'Error deleting message')
  }
  res.redirect('/')
})

module.exports = router