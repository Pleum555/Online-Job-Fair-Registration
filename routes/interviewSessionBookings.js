const express = require('express');

const { getBookings, getBooking, addBooking, updateBooking, deleteBooking } = require('../controllers/interviewSessionBookings');

const router = express.Router({mergeParams:true});

const {protect, authorize}= require('../middleware/auth');

router.route('/')
    .get(protect, authorize('admin', 'user'), getBookings)
    .post(protect, authorize('admin', 'user'), addBooking);
router.route('/:id')
    .put(protect, authorize('admin', 'user'), updateBooking)
    .delete(protect, authorize('admin', 'user'), deleteBooking);

module.exports=router;