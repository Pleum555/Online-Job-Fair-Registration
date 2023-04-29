const express = require('express');
const { getCompanies, createCompany, updateCompany, deleteCompany } = require('../controllers/companies');


//Include other resource routers
//const appointmentRouter = require('./appointments');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

//Re-route into other resource routers
//router.use('/:hospitalId/appointments/', appointmentRouter);

// router.route('/vacCenters').get(getVacCenters);
router.route('/').get(protect,authorize('user', 'admin'), getCompanies).post(protect, authorize('admin'), createCompany);
router.route('/:id').put(protect, authorize('admin'), updateCompany).delete(protect, authorize('admin'), deleteCompany);

module.exports=router;
