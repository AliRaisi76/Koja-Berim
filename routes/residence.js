const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Residence = require('../models/residence')
const residences = require('../controllers/residences')
const { isLoggedIn, isAuthor, validateResidence } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.get('/residences' ,catchAsync(residences.index))

router.post('/residences',isLoggedIn,upload.array('image'),validateResidence,catchAsync(residences.createResidence))
 

router.get('/residences/new',isLoggedIn,residences.renderNewForm)

router.get('/residences/:id', catchAsync(residences.showResidence))

router.put('/residences/:id',isLoggedIn,isAuthor,upload.array('image'), validateResidence, catchAsync(residences.updateResidences))

router.delete('/residences/:id',isLoggedIn,isAuthor,catchAsync(residences.deleteResidences))

router.get('/residences/:id/edit',isLoggedIn,isAuthor,catchAsync(residences.renderEditForm))


module.exports = router