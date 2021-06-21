const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Campground = require('./campground')
const Residence = require('./residence')
const Review = require('./review')
const passportLocalMongoose = require('passport-local-mongoose')
const { cloudinary } = require('../cloudinary')





const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    campgrounds: [
        {
            type: Schema.Types.ObjectId,
            ref: Campground
        }
    ],
    assets: [{
        type: Schema.Types.ObjectId,
        ref: 'Residence'
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Reviews'
    }]
})



UserSchema.plugin(passportLocalMongoose)


UserSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Residence.deleteMany({
            _id: {
                $in: doc.assets
            }
        })
    }
})

UserSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Campground.deleteMany({
            _id: {
                $in: doc.campgrounds
            }
        })
    }
})

UserSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})



module.exports = mongoose.model('User', UserSchema)