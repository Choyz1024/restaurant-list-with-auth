const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const restaurant = require('./modules/restaurant')
const users = require('./modules/users')


router.use('/restaurant', restaurant)
router.use('/users', users) 
router.use('/', home)

module.exports = router
