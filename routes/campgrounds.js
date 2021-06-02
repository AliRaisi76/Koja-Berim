const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemas')
const { isLoggedIn } = require('../middleware')
// a little change




// middleware to validate the campground information passed thriugh the request body
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}



// route to show all of the campgrounds 
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

// route to the creating new camp page
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})


//route baraye sakhtane camp jadid 
router.post('/', validateCampground, isLoggedIn, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success', 'با موفقیت یک کمپ جدید ایجاد شد ! ')
    res.redirect(`/campgrounds/${campground._id}`)
}))


// show route. show details of a particular camp
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
<<<<<<< HEAD
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
=======
    if(!campground){
        req.flash('error', 'کمپ مورد نظر پیدا نشد !')
>>>>>>> a9b930cdaab8f2ece765fc8a4f0b2518e9010fca
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))

// to the page of editing a campground
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
<<<<<<< HEAD
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
=======
    if(!campground){
        req.flash('error', 'کمپ مورد نظر پیدا نشد !')
>>>>>>> a9b930cdaab8f2ece765fc8a4f0b2518e9010fca
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

// route to the editing campground 
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'کمپ با موفقیت ویرایش شد !')

    res.redirect(`/campgrounds/${campground._id}`)
}))


// delete an inidvidual campground
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'کمپ با موفقیت حذف شد !')

    res.redirect('/campgrounds')
}))


module.exports = router
