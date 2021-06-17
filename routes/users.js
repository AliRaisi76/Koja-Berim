const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const passport = require('passport')
const users = require('../controllers/users')
const { isLoggedIn } = require('../middleware')


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))


router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), users.login)


router.get('/:id/edit', isLoggedIn, users.renderEditUser)
router.put('/:id', users.updateUser)


router.get('/logout', users.logout)

router.get('/:id', users.renderUser)


module.exports = router

