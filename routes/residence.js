const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Residence = require('../models/residence')
const residences = require('../controllers/residences')
const { isLoggedIn, residenceIsAuthor, validateResidence } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })


router.route('/')
.get(catchAsync(residences.index))
.post(isLoggedIn,upload.array('image'),validateResidence,catchAsync(residences.createResidence))
 

router.get('/new',isLoggedIn,residences.renderNewForm)


router.route('/:id')
.get( catchAsync(residences.showResidence))
.put(isLoggedIn,residenceIsAuthor,upload.array('image'), validateResidence, catchAsync(residences.updateResidences))
.delete(isLoggedIn,residenceIsAuthor,catchAsync(residences.deleteResidences))


router.get('/:id/edit',isLoggedIn,residenceIsAuthor,catchAsync(residences.renderEditForm))


module.exports = router