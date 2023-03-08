const express = require('express');
const router = express.Router();

const medicationController = require('../controllers/medicationController');


const hasAccess = require('../midleware/user');
router.use('/', hasAccess.hasAccess);

//actual routes
router.get("/", medicationController.getIndex);
router.post("/api/get/all", medicationController.medicationGetAll);
router.post("/api/add", medicationController.medicationAdd);
router.post("/api/update", medicationController.medicationUpdate);
router.post("/api/delete", medicationController.medicationDelete);


module.exports = router;