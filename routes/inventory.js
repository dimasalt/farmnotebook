const express = require('express');
const router = express.Router();

const typesController = require('../controllers/inventory/typesController');


const hasAccess = require('../midleware/user');
router.use('/', hasAccess.hasAccess);

//actual routes
router.get("/types", typesController.getIndex);
router.post("/types/api/get/all", typesController.getTypes);
// router.post("/api/get/vendors", contactController.getVendorList);
// router.post("/api/add", contactController.contactAdd);
// router.post("/api/update", contactController.contactUpdate);
// router.post("/api/delete", contactController.deleteContact);



module.exports = router;