const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}
const RestaurantList = require('../restaurants')
const restaurantSeeder = require('../../restaurant.json')

const Users = require('../users')
const userSeeder = [
  {
    email: 'user1@example.com',
    password: '12345678',
    restaurants: [1, 2, 3]
  },
  {
    email: 'user2@example.com',
    password: '12345678',
    restaurants: [4, 5, 6]
  }
]

const db = require('../../config/mongoose')

db.once('open', () => {
  for (let i = 0; i < userSeeder.length; i++) {
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(userSeeder[i].password, salt))
      .then(hash => Users.create({ email: userSeeder[i].email, password: hash }))
      .then(user => {
        const userId = user._id
        return Promise.all(Array.from(
          userSeeder[i].restaurants,  //[1, 2, 3]
          (v, _) => RestaurantList.create({
            name: restaurantSeeder.results[v - 1].name,
            name_en: restaurantSeeder.results[v - 1].name_en,
            category: restaurantSeeder.results[v - 1].category,
            image: restaurantSeeder.results[v - 1].image,
            location: restaurantSeeder.results[v - 1].location,
            phone: restaurantSeeder.results[v - 1].phone,
            google_map: restaurantSeeder.results[v - 1].google_map,
            rating: restaurantSeeder.results[v - 1].rating,
            description: restaurantSeeder.results[v - 1].description,
            userId
          })
        ))
      })
      .catch(err => console.log(err))
  }
  console.log('Done')
})