const mongoose = require('mongoose')

// 與資料庫連線
// mongoose.connect('mongodb://localhost/restaurant-list-auth')
mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection
db.on('error', () => {
  console.log('Failed to connect with MongoDB')
})
db.once('open', () => {
  console.log('MongoDB connected!')
})

module.exports = db