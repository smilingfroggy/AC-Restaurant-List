const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const Users = require('../models/users')

// 登入驗證資訊
module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    Users.findOne({ email })
      .then((user) => {
        if (!user) {
          console.log('此帳號尚未註冊')
          return done(null, false, { message: '您尚未註冊' })
        }
        bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            console.log('密碼錯誤')
            return done(null, false, { message: '帳號或密碼錯誤' })
          }
          return done(null, user)
        })
      })
      .catch((err) => done(err, false))
  }))
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { email, name } = profile._json
    Users.find({ email })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: '帳號或密碼錯誤' })
        }
        const randomPassword = Math.random().toString(36).slice(-8)
        return bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => Users.create({ name, email, password: hash }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }
  ));
  passport.serializeUser((user, done) => {
    return done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    Users.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}