const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = { toJSON: { virtuals: true } }
const residenceSchema = new Schema({
    title: String,
    geometry: {
        type: {
            type: [String],
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    price: Number,
    description: String,
    phoneNumber:Number,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts)

residenceSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/residences/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`
})

module.exports = mongoose.model('Residence', residenceSchema)
