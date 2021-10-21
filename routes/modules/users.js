const express = require('express')
const router = express.Router()
const Users = require('../../models/users')

router.get('/login', (req, res) => {
  res.send('Login page')
})

router.post('/login', (req, res) => {
  res.send('Login page')
})

router.get('/register', (req, res) => {
  res.send('register')
})

router.post('/register', (req, res) => {
  res.send('register')
})

module.exports = router