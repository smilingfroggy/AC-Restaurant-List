const RestaurantList = require('../restaurants')
const restaurantSeeder = require('../../restaurant.json')

const db = require('../../config/mongoose')

db.once('open', () => {
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
  console.log('Done')
})