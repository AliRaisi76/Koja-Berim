const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Residence = require('../models/residence')
const residences = require('../controllers/residences')
const { isLoggedIn, isAuthor, validateResidence } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })


router.route('/')
.get(catchAsync(residences.index))
.post(isLoggedIn,upload.array('image'),validateResidence,catchAsync(residences.createResidence))
 

router.get('/new',isLoggedIn,residences.renderNewForm)


router.route('/:id')
.get( catchAsync(residences.showResidence))
.put(isLoggedIn,isAuthor,upload.array('image'), validateResidence, catchAsync(residences.updateResidences))
.delete(isLoggedIn,isAuthor,catchAsync(residences.deleteResidences))


router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(residences.renderEditForm))


module.exports = router