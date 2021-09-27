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

// 2. create new restaurant -- 要放在3. show 特定餐廳前面，new才不會被判斷為:storeID
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})


app.post('/restaurants', (req, res) => {
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  console.log('to create new store: ' + name)
  RestaurantList.create({ name, name_en, category, image, location, phone, google_map, rating, description })
    .then(() => res.redirect('/'))
    .catch(error => { console.error(error) })
})

// 3. show 特定餐廳
app.get('/restaurants/:storeID', (req, res) => {
  RestaurantList.findById(req.params.storeID)
    .lean()
    .then(storeInfo => res.render('show', { storeInfo }))
    .catch(error => { console.error(error) })
})

// 4. search result 搜尋結果
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  console.log('keyword: ' + keyword)
  RestaurantList.find({
    $or: [{ name: { $regex: keyword, $options: 'i' } },
    { name_en: { $regex: keyword, $options: 'i' } },
    { location: { $regex: keyword, $options: 'i' } },
    { category: { $regex: keyword, $options: 'i' } }]
  })
    .lean()
    .then(storeSearched => {
      if (storeSearched.length === 0) {
        res.render('index_noResult')
      } else {
        res.render('index', { restaurantIntro: storeSearched, keyword: keyword })
      }
    })
    .catch(error => console.error(error))
})

// 5. edit restaurant
app.get('/restaurants/edit/:storeID', (req, res) => {
  console.log('edit info, storeID:' + req.params.storeID)
  RestaurantList.findById(req.params.storeID)
    .lean()
    .then(storeInfo => res.render('edit', { storeInfo }))
    .catch(error => { console.error(error) })
})


app.post('/restaurants/edit/:storeID', (req, res) => {
  console.log('save edited info, storeID:' + req.params.storeID)
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  RestaurantList.findById(req.params.storeID)
    .then(storeInfo => {
      storeInfo.name = name
      storeInfo.name_en = name_en
      storeInfo.category = category
      storeInfo.image = image
      storeInfo.location = location
      storeInfo.phone = phone
      storeInfo.google_map = google_map
      storeInfo.rating = rating
      storeInfo.description = description
      return storeInfo.save()
    })
    .then(() => { res.redirect(`/restaurants/${req.params.storeID}`) })
    .catch(error => { console.error(error) })
})



app.listen(port, () => {
  console.log(`Express is listening at localhost:${port}`)
})