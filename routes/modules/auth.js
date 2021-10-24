const express = require('express')
const router = express.Router()
const passport = require('passport')

// 向FB請求資料
router.get('/facebook/', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

// 接收FB資料後
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

module.exports = router