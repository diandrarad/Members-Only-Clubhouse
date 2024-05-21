require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const User = require('./models/User')

const app = express()

mongoose.connect(process.env.MONGO_URI)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"))

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  next()
})

app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))