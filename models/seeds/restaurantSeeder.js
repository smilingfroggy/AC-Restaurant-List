const mongoose = require('mongoose')
const RestaurantList = require('../restaurants')
const restaurantSeeder = require('../../restaurant.json')
mongoose.connect('mongodb://localhost/restaurant-list')

const db = mongoose.connection

// 確認連線狀態
db.on('error', () => {
  console.log('Fail to connect to mongodb!')
})

db.once('open', () => {
  console.log('mongodb connected')
  for (let i = 0; i < restaurantSeeder.results.length; i++) {
    RestaurantList.create({
      name: restaurantSeeder.results[i].name,
      name_en: restaurantSeeder.results[i].name_en,
      category: restaurantSeeder.results[i].category,
      image: restaurantSeeder.results[i].image,
      location: restaurantSeeder.results[i].location,
      phone: restaurantSeeder.results[i].phone,
      google_map: restaurantSeeder.results[i].google_map,
      rating: restaurantSeeder.results[i].rating,
      description: restaurantSeeder.results[i].description
    })
  }
})