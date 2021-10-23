const mongoose = require('mongoose')
const Schema = mongoose.Schema

const restaurantSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  name_en: {
    type: String,
    require: false
  },
  category: {
    type: String,
    require: true
  },
  image: {
    type: String,
    require: true
  },
  location: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  },
  google_map: {
    type: String,
    require: true
  },
  rating: {
    type: Number,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Users",
    index: true
  }

})

module.exports = mongoose.model('RestaurantList', restaurantSchema)