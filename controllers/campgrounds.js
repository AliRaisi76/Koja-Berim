const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require('../cloudinary')
const User = require('../models/user')




module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    // const geoData = await geocoder.reverseGeocode({
    //     query: req.body.campground.location,
    //     limit: 1
    // }).send()
    const campground = new Campground(req.body.campground)
    // error handling baraye peida nashodane makan
    // if(!geoData.body.features[0]){
    //     req.flash('error', 'مکان مورد نظر پیدا نشد!')
    //     return res.redirect('/campgrounds/new')
    // }
    // campground.geometry = geoData.body.features[0].geometry
    campground.geometry.coordinates.push(req.body.campground.locationLng)
    campground.geometry.coordinates.push(req.body.campground.locationLat)
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id

    // ezafe kardane id camp be modele user
    const user = await User.findById(req.user._id)
    user.campgrounds.push(campground._id)

    await campground.save()

    await user.save()


    req.flash('success', 'با موفقیت یک کمپ جدید ایجاد شد ! ')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!campground) {
        req.flash('error', 'کمپ مورد نظر یافت نشد!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'کمپ مورد نظر پیدا نشد !')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/edit', { campground })
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs)
    // const geoData = await geocoder.forwardGeocode({
    //     query: req.body.campground.location,
    //     limit: 1
    // }).send()
    // error handling baraye peida nashodane makan
    // if(!geoData.body.features[0]){
    //     req.flash('error', 'مکان مورد نظر پیدا نشد!')
    //     return res.redirect('/campgrounds/new')
    // }
    campground.geometry.coordinates = (req.body.campground.locationLng)
    campground.geometry.coordinates.push(req.body.campground.locationLat)
    // campground.geometry = geoData.body.features[0].geometry
    campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'کمپ با موفقیت ویرایش شد !')
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id) 
    for (let image of campground.images){
        await cloudinary.uploader.destroy(image.filename)
    }
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'کمپ با موفقیت حذف شد !')

    res.redirect('/campgrounds')
}