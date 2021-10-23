const express = require('express')
const router = express.Router()
const RestaurantList = require('../../models/restaurants')

// 1. create new restaurant-- 要放在3.show 特定餐廳前面，new才不會被判斷為: storeID
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  const userId = req.user._id
  console.log(`to create new store: ${name} by ${userId}`)
  RestaurantList.create({ name, name_en, category, image, location, phone, google_map, rating, description, userId })
    .then(() => res.redirect('/'))
    .catch(error => { console.error(error) })
})

// 2. show 特定餐廳
router.get('/:storeID', (req, res) => {
  const userId = req.user._id
  const _id = req.params.storeID
  // RestaurantList.findById(req.params.storeID)
  RestaurantList.findOne({ _id, userId })
    .lean()
    .then(storeInfo => res.render('show', { storeInfo }))
    .catch(error => { console.error(error) })
})

// 3. edit restaurant
router.get('/edit/:storeID', (req, res) => {
  const userId = req.user._id
  const _id = req.params.storeID
  console.log(`edit info, storeID: ${_id} by user ${userId}`)
  RestaurantList.findOne({ _id, userId })
    .lean()
    .then(storeInfo => res.render('edit', { storeInfo }))
    .catch(error => { console.error(error) })
})

router.put('/:storeID', (req, res) => {
  const userId = req.user._id
  const _id = req.params.storeID
  console.log(`save edited info, storeID: ${_id}`)
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  RestaurantList.findOne({ _id, userId })
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
    .then(() => { res.redirect(`/restaurants/${_id}`) })
    .catch(error => { console.error(error) })
})

// 4. delete restaurant
router.delete('/:storeID', (req, res) => {
  const userId = req.user._id
  const _id = req.params.storeID
  console.log('delete storeID:' + req.params.storeID)
  RestaurantList.findOne({ _id, userId })
    .then(storeInfo => storeInfo.remove())
    .then(res.redirect('/'))
    .catch(error => { console.error(error) })
})

module.exports = router

