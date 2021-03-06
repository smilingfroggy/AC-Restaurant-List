const express = require('express')
const app = express()
const session = require('express-session')
const usePassport = require('./config/passport')
const flash = require('connect-flash')
const routes = require('./routes')
const methodOverride = require('method-override')
const exphbs = require('express-handlebars')
// const RestaurantList = require('./models/restaurants')
// const users = require('./models/users')

if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}
const port = process.env.PORT

require('./config/mongoose')

// session options and passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
usePassport(app)

app.use(flash())

// pass isAuthenticated & user info from req to res
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('successful_msg')
  res.locals.warning_msg = req.flash('warning_msg')
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