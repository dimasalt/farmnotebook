const express = require('express');
const router = express.Router();

//livestock type controller
const typesController = require('../controllers/inventory/types/typesController');

//livestock
const livestockController = require('../controllers/inventory/livestock/livestockController');


const hasAccess = require('../midleware/user');
router.use('/', hasAccess.hasAccess);

//types routes
router.get("/types", typesController.getIndex);
router.post("/types/api/get/all", typesController.getTypes);
router.post("/types/api/add", typesController.saveTypes);
router.post("/types/api/delete", typesController.deleteTypes);



//livestock routes
router.get("/livestock", livestockController.getIndex);
router.post("/livestock/api/get/all", livestockController.getLivestockInventory);



module.exports = router;