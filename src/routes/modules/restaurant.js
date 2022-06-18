const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const newRestaurant = req.body
  newRestaurant.userId = req.user._id
  Restaurant.create(newRestaurant)
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

router.get('/:restaurantId', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurantId
  Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurantData) => res.render('show', { restaurantData }))
    .catch((error) => console.log(error))
})

router.delete('/:restaurantId', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurantId
  Restaurant.findOneAndDelete({ _id, userId })
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err))
})

router.get('/:restaurantId/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurantId
  Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurantData) => res.render('edit', { restaurantData }))
    .catch((err) => console.log(err))
})

router.put('/:restaurantId', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurantId
  Restaurant.findOneAndUpdate({ _id, userId }, req.body)
    .then(() => res.redirect(`/restaurant/${_id}`))
    .catch((err) => console.log(err))
})

module.exports = router
