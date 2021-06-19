const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        // price: Joi.number().required().min(0),
        // image: Joi.string().valid(['image/jpeg']).required(),
        locationLng: Joi.string().required().escapeHTML(),
        locationLat: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
})


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().trim().required().escapeHTML(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})

module.exports.residenceSchema = Joi.object({
    residence:Joi.object({
        title:Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        location:Joi.string().required().escapeHTML(),
        locationLng: Joi.string().required().escapeHTML(),
        locationLat: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        phoneNumber: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
        

    })
