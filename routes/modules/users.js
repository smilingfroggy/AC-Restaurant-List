const express = require('express')
const router = express.Router()
const Users = require('../../models/users')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {
  res.send('Login page')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  //檢查Email是否重複註冊過
  //檢查兩密碼是否相符
  res.send('register')
})

module.exports = router