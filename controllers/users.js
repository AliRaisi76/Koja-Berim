const { findById } = require('../models/user')
const User = require('../models/user')
const Campground = require('../models/campground')



module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password, isLandlord } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'به کجابریم خوش‌آمدید!')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/users/register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'خوش برگشتین!')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.renderUser = async (req, res) => {
    const id = req.params.id
    const user = await User.findById(id).populate('campgrounds')
    res.render('users/show', { user })
}

module.exports.logout = (req, res) => {
    req.logOut()
    req.flash('success', 'خدانگهدار!')
    res.redirect('/users/login')
}