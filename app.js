const express = require('express')
const app = express()
const mongoose = require('mongoose')
const RestaurantList = require('./models/restaurants')
const exphbs = require('express-handlebars')
const port = 3000


// 與資料庫連線
mongoose.connect('mongodb://localhost/restaurant-list')
const db = mongoose.connection
db.on('error', () => {
  console.log('Failed to connect with MongoDB')
})
db.once('open', () => {
  console.log('MongoDB connected!')
})

// template engine setting
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// router setting
// 1. index 首頁
app.get('/', (req, res) => {
  RestaurantList.find() //為何不用return?
    .lean()
    .then(restaurantIntro => { res.render('index', { restaurantIntro }) })
    .catch(error => { console.error(error) })
})

// 2. show 特定餐廳
app.get('/restaurants/:storeID', (req, res) => {
  // const storeInfo = restaurantList.results.find((store) => {
  //   return store.id.toString() === req.params.storeID
  // })
  RestaurantList.findById(req.params.storeID)
    .lean()
    .then(storeInfo => res.render('show', { storeInfo }))
    .catch(error => { console.error(error) })
})

// 3. search result 搜尋結果
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  console.log('keyword: ' + keyword)
  RestaurantList.find({ name: { $regex: keyword, $options: 'i' } })
    .lean()
    .then(storeSearched => {
      console.log(storeSearched)
      if (storeSearched.length === 0) {
        res.render('index_noResult')
      } else {
        res.render('index', { restaurantIntro: storeSearched, keyword: keyword })
      }
    })
    .catch(error => console.error(error))
})

app.listen(port, () => {
  console.log(`Express is listening at localhost:${port}`)
})