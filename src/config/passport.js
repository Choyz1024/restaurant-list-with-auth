const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/User')

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(
    new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user || user.password !== password) {
            return done(null, false, { message: 'Email or Password is incorrect.' })
          }
          return done(null, user)
        })
        .catch((err) => done(err, false))
    })
  )

  // passport.use(
  //   new FacebookStrategy({
  //     //TODO: facebook auth
  //   })
  // )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null))
  })
}
