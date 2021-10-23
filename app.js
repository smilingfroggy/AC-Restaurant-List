const express = require('express')
const app = express()
const session = require('express-session')
const usePassport = require('./config/passport')
const routes = require('./routes')
const RestaurantList = require('./models/restaurants')
const methodOverride = require('method-override')
const exphbs = require('express-handlebars')
const users = require('./models/users')
const port = 3000

require('./config/mongoose')

// session options and passport
app.use(session({
  secret: "MySecretKey",
  resave: false,
  saveUninitialized: true
}))
usePassport(app)

// pass isAuthenticated & user info from req to res
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

// template engine setting
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// method-override
app.use(methodOverride('_method'))

// router setting
app.use(routes)


app.listen(port, () => {
  console.log(`Express is listening at localhost:${port}`)
})