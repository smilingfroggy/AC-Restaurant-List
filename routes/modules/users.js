const express = require('express')
const router = express.Router()
const passport = require('passport')
const Users = require('../../models/users')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  //檢查Email是否重複註冊過
  if (!email || !password || !confirmPassword) {
    console.log('請輸入所有必填欄位')
    return res.render('register')
  }
  if (password !== confirmPassword) {
    console.log('兩次輸入密碼不同！')
    return res.render('register')
  }
  Users.findOne({ email })
    .then((user) => {
      if (user) {
        console.log('此email已註冊過')
        return res.render('register', { name, email, password, confirmPassword })
      }

      // 無任何錯誤，使用者資料寫入資料庫
      return Users.create({ name, email, password })
        .then(() => {
          console.log(`${name}'s account is created!`)
          res.redirect('/')
        })
        .catch(err => console.log(err))

    })
})

module.exports = router