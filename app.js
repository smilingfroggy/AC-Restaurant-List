const express = require('express')
const app = express()
const session = require('express-session')
const routes = require('./routes')
const RestaurantList = require('./models/restaurants')
const methodOverride = require('method-override')
const exphbs = require('express-handlebars')
const port = 3000

require('./config/mongoose')
// session options
app.use(session({
  secret: "MySecretKey",
  resave: false,
  saveUninitialized: true
}))

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