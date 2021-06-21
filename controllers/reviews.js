const Review = require('../models/review')
const Campground = require('../models/campground')
const User = require('../models/user')


module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const user = await User.findById(req.user._id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    user.reviews.push(review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    await user.save()
    req.flash('success', ' کامنت جدید ایجاد شد!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', ' کامنت با موفقیت حذف شد !')

    res.redirect(`/campgrounds/${id}`)
}