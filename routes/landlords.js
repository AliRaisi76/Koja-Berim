const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Landlord = require('../models/landlord')
const passport = require('passport')
const landlords = require('../controllers/landlords')

router.route('/register')
    .get(landlords.renderRegister)
    .post(catchAsync(landlords.register))

router.route('/login')
    .get(landlords.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/landlords/login' }), landlords.login)


// router.get('/:id', landlords.renderLandlord)

router.get('/logout', landlords.logout)




module.exports = router
