const router = require('express').Router()

const reviewController = require('../../controllers/reviewController')
const auth = require('../../middleware/auth')

// @route   POST /createReview
// @desc    create review
// @access  Private
router.post('/createReview', auth,  reviewController.createReview)

// @route   GET /getReview/:id
// @desc    get a particular review
// @access  Private
router.get('/getReview/:id', auth, reviewController.getReview)

// @route   GET /getAllReview
// @desc    Get all reviews
// @access  Public
router.get('/getAllReview', reviewController.getAllReviews)

// @route   PUT /updateReview/:id
// @desc    Update review detail(only admin can update product)
// @access  Private
router.put('/updateReview/:id', auth, reviewController.updateReview)

// @route   DELETE /deleteReview/:reviewId
// @desc    Delete product detail(only admin can delete product)
// @access  Private
router.delete('/deleteReview/:reviewId', auth, reviewController.deleteReview)

module.exports = router