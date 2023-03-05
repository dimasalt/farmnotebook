const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contactController');


const hasAccess = require('../midleware/user');
router.use('/', hasAccess.hasAccess);

//actual routes
router.get("/", contactController.getIndex);
router.post("/api/get/all", contactController.contactsGetAll);
router.post("/api/get/vendors", contactController.getVendorList);
router.post("/api/add", contactController.contactAdd);
router.post("/api/update", contactController.contactUpdate);
router.post("/api/delete", contactController.deleteContact);



module.exports = router;