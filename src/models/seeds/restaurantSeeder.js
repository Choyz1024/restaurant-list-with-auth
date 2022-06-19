const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantList = require('./restaurant.json').results

const USER_LIST = [
  {
    email: 'user1@example.com',
    password: '12345678',
  },
  {
    email: 'user2@example.com',
    password: '12345678',
  },
]

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('Seeding: restaurantSeeder ... ')

  Promise.all(
    Array.from(USER_LIST, (seedUser, userIndex) => {
      bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(seedUser.password.toString(), salt))
        .then((hash) =>
          User.create({
            name: `seedUser_${userIndex}`,
            email: seedUser.email,
            password: hash,
            type: 'email',
          })
        )
        .then((user) => {
          Array.from(restaurantList, (restaurant, restaurantIndex) => {
            if (userIndex === parseInt(restaurantIndex / 3)) {
              restaurant.userId = user._id
              Restaurant.create(restaurant)
            }
          })
        })
    })
  ).then(() => {
    console.log('Database seeding completed successfully.')
  })
})
