const Residence = require('../models/residence')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require('../cloudinary')
const User = require('../models/user')


module.exports.index = async (req, res) => {
    const residences = await Residence.find({})
    res.render('residences/index', { residences })
}


module.exports.renderNewForm = (req, res) => {
    res.render('residences/new')
}


module.exports.createResidence = async (req, res, next) => {
    // const geoData = await geocoder.reverseGeocode({
    //     query: req.body.campground.location,
    //     limit: 1
    // }).send()
    const residence = new Residence(req.body.residence)
    // error handling baraye peida nashodane makan
    // if(!geoData.body.features[0]){
    //     req.flash('error', 'مکان مورد نظر پیدا نشد!')
    //     return res.redirect('/campgrounds/new')
    // }
    // campground.geometry = geoData.body.features[0].geometry
    residence.geometry.coordinates.push(req.body.residence.locationLng)
    residence.geometry.coordinates.push(req.body.residence.locationLat)
    residence.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    residence.author = req.user._id

    // ezafe kardane id camp be modele user
    const user = await User.findById(req.user._id)
    user.assets.push(residence._id)

    await residence.save()

    await user.save()


    req.flash('success', 'با موفقیت یک کمپ جدید ایجاد شد ! ')
    res.redirect(`/residences/${residence._id}`)
}


module.exports.showResidence = async (req, res) => {
    const residence = await Residence.findById(req.params.id).populate('author')
    if (!residence) {
        req.flash('error', 'قادر به پیدا کردن ملک مورد نظر نمیباشد!')
        return res.redirect('/residences')
    }
    res.render('residences/show', { residence })
}


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const residence = await Residence.findById(id)
    if (!residence) {
        req.flash('error', ' قادر به پیدا کردن ملک مورد نظر نمیباشد!')
        return res.redirect('/residences')
    }

    res.render('residences/edit', { residence })
}



module.exports.updateResidences = async (req, res) => {
    const { id } = req.params
    const residence = await Residence.findByIdAndUpdate(id, { ...req.body.residence })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    residence.images.push(...imgs)
    // const geoData = await geocoder.forwardGeocode({
    //     query: req.body.campground.location,
    //     limit: 1
    // }).send()
    // error handling baraye peida nashodane makan
    if(!geoData.body.features[0]){
        req.flash('error', 'مکان مورد نظر پیدا نشد!')
        return res.redirect('/residences/new')
    }
    residence.geometry = geoData.body.features[0].geometry
    residence.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await residence.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'کمپ با موفقیت ویرایش شد !')
    res.redirect(`/residences/${residence._id}`)
}


module.exports.deleteResidences = async (req, res) => {
    const { id } = req.params
    await Residence.findByIdAndDelete(id)
    req.flash('success', ' با موفقیت حذف شد !')

    res.redirect('/residences')
}
