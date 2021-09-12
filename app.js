const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const port = 3000
const restaurantList = require('./restaurant.json')

// template engine setting
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// static files
app.use(express.static('public'))

// router setting
// 1. index 首頁
app.get('/', (req, res) => {
  res.render('index', { restaurantIntro: restaurantList.results })
})

// 2. show 特定餐廳
app.get('/restaurants/:storeID', (req, res) => {
  const storeInfo = restaurantList.results.find((store) => {
    return store.id.toString() === req.params.storeID
  })
  res.render('show', { restaurantIntro: restaurantList.results, storeInfo: storeInfo })
})

// 3. search result 搜尋結果
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const storeSearched = restaurantList.results.filter((store) => {
    return store.name.toLowerCase().includes(keyword.toLowerCase()) || store.category.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurantIntro: storeSearched, keyword: keyword })
})


app.listen(port, () => {
  console.log(`Express is listening at localhost:${port}`)
})