const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Campground = require('./campground')
const Residence = require('./residence')
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
        ref: 'Residence'
    }
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)