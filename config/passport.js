const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
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
          return done(null, false, { message: 'This email is not registered!' })
        }
        bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            console.log('密碼錯誤')
            return done(null, false, { message: 'Wrong email or password' })
          }
          return done(null, user)
        })
      })
      .catch((err) => done(err, false))
  }))
  passport.serializeUser((user, done) => {
    console.log('serializing')
    return done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    console.log('deserializing')
    Users.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}