const { findById } = require('../models/user')
const User = require('../models/user')
const Campground = require('../models/campground')
const session = require('express-session')
const express = require('express')
const app = express()
const { cloudinary } = require('../cloudinary')




module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body
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
    const user = await User.findById(id).populate('campgrounds').populate('assets')
    res.render('users/show', { user })
}


module.exports.renderEditUser = async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id).populate('campgrounds')
    if (!user) {
        req.flash('error', 'کاربر مورد نظر پیدا نشد !')
        return res.redirect('/users/login')
    }
    res.render('users/edit', { user })
}

module.exports.updateUser = async (req, res) => {
    const id = req.params.id
    const { username, email, password } = req.body
    const user = await User.findByIdAndUpdate(id, { username, email })
    // if (!user) {
    //     req.flash('error', 'کاربر مورد نظر پیدا نشد!')
    //     return res.redirect(`/users/${id}/edit`)
    // }
    const sanitizedUser = await User.findByUsername(username);
    try {
        await sanitizedUser.setPassword(password);
        await sanitizedUser.save();
    } catch (err) {
        res.status(422).send(err);
    }
    user.save()
    req.flash('success', 'پروفایل با موفقیت ویرایش شد !')
    res.redirect('/users/login')
}



module.exports.deleteUser = async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id).populate('campgrounds').populate('assets')
    for (let campground of user.campgrounds) {
        for (let image of campground.images) {
            await cloudinary.uploader.destroy(image.filename)
        }
    }
    for (let asset of user.assets) {
        for (let image of asset.images) {
            await cloudinary.uploader.destroy(image.filename)
        }
    }
    await User.findByIdAndDelete(id)
    req.flash('success', 'کاربر با موفقیت حذف شد !')
    res.redirect('/campgrounds')
}

module.exports.logout = (req, res) => {
    req.logOut()
    req.flash('success', 'خدانگهدار!')
    res.redirect('/users/login')
}