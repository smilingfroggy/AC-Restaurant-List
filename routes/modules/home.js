const express = require('express')
const router = express.Router()
const RestaurantList = require('../../models/restaurants')

// 1. index 首頁
router.get('/', (req, res) => {
  const sort = req.query.sort

  if (sort === "asc" || sort === "desc") {
    RestaurantList.find()
      .lean()
      .sort({ 'name': sort })
      .then(restaurantIntro => { res.render('index', { restaurantIntro }) })
      .catch(error => { console.error(error) })
  } else if (sort === "cat") {
    RestaurantList.find()
      .lean()
      .sort({ category: 'asc' })
      .then(restaurantIntro => { res.render('index', { restaurantIntro }) })
      .catch(error => { console.error(error) })
  } else if (sort === "loc") {
    RestaurantList.find()
      .lean()
      .sort({ location: 'asc' })
      .then(restaurantIntro => { res.render('index', { restaurantIntro }) })
      .catch(error => { console.error(error) })
  } else {
    RestaurantList.find()
      .lean()
      .then(restaurantIntro => { res.render('index', { restaurantIntro }) })
      .catch(error => { console.error(error) })
  }
})


// 2. search result 搜尋結果
router.get('/search', (req, res) => {
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

module.exports = router