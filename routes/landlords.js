const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const landlords = require('../controllers/landlords')

router.route('/register')
    .get(landlords.renderRegister)
    .post(catchAsync(landlords.register))

router.route('/login')
    .get(landlords.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/landlords/login' }), landlords.login)



router.get('/logout', landlords.logout)

router.get('/:id/edit', landlords.renderEditLandlord)


router.get('/:id', landlords.renderLandlord)

router.put('/:id', landlords.updateLandlord)






module.exports = router
