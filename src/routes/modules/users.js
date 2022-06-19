const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../../models/User')

router.get('/login', (req, res) => {
  res.render('login', {
    error: req.flash('error'),
  })
})

router.post(
  '/login', (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      req.flash('warning_msg', 'Please enter Email & Password.')
      return res.redirect('/users/login')
    }
    return next()
  } ,
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
  })
)

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You have been successfully logged out.')
  res.redirect('/users/login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'All fields are required.' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'The password confirmation does not match!' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword,
    })
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        errors.push({ message: 'This email is already being used.' })
        return res.render('register', {
          errors,
          name,
          email,
        })
      }
      return User.create({
        name,
        email,
        password,
        type: 'email',
      })
        .then(() => res.redirect('/'))
        .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
})

module.exports = router
