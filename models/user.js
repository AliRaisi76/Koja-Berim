const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Campground = require('./campground')
const passportLocalMongoose = require('passport-local-mongoose')

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
    assets: {
        type :Schema.Types.ObjectId,
        ref: ''
    }
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)