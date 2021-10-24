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
    restaurants: [0, 1, 2]
  },
  {
    email: 'user2@example.com',
    password: '12345678',
    restaurants: [3, 4, 5]
  }
]

const db = require('../../config/mongoose')

db.once('open', () => {
  Promise.all(Array.from(
    userSeeder, userSeed => {
      console.log(userSeed)
      bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(userSeed.password, salt))
        .then(hash => Users.create({ email: userSeed.email, password: hash }))
        .then(user => {
          const userId = user._id
          console.log(userSeed.restaurants) //[ 4, 5, 6 ]
          const userRestaurants = userSeed.restaurants.map( i => {
            restaurantSeeder.results[i].userId = userId
            return restaurantSeeder.results[i]
          })
          return RestaurantList.create(userRestaurants)
        })
    }
  ))
    .then(() => {
      console.log('Done')
      // process.exit()
    })
    .catch(err => console.log(err))
})