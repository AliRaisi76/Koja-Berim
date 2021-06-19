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


router.get('/logout', users.logout)


router.route('/:id')
    .put(isLoggedIn, users.updateUser)
    .get(isLoggedIn, users.renderUser)
    .delete(isLoggedIn, users.deleteUser)



module.exports = router

