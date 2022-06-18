const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../../models/User')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
  })
)

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ email })
    .then((user) => {
      if (user) {
        console.log('User already exists.')
        res.render('register', {
          name,
          email,
        })
      } else {
        return User.create({
          name,
          email,
          password,
          type: 'email',
        })
          .then(() => res.redirect('/'))
          .catch((err) => console.log(err))
      }
    })
    .catch((err) => console.log(err))
})

module.exports = router
