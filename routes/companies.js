const express = require('express');
const { getCompanies, getCompany, createCompany, updateCompany, deleteCompany} = require('../controllers/companies');

//Include other resource routers
const interviewSessionBookingRouter = require('./interviewSessionBookings');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:companyId/interviewsessionbookings', interviewSessionBookingRouter);

router.route('/')
    .get(protect, authorize('admin', 'user'), getCompanies)
    .post(protect, authorize('admin'), createCompany);
router.route('/:id')
    .get(protect, authorize('admin'), getCompany)
    .put(protect, authorize('admin'), updateCompany)
    .delete(protect, authorize('admin'), deleteCompany);

module.exports=router;
