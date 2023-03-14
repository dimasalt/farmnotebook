const express = require('express');
const router = express.Router();

const feedController = require('../controllers/ration/feeds/feedController');
const feedRequirementController = require('../controllers/ration/feed_requirement/feedRequirementController');
const feedCalculator = require('../controllers/ration/calculator/feedCalculatorController');


const hasAccess = require('../midleware/user');
router.use('/', hasAccess.hasAccess);

//actual routes
router.get("/feeds", feedController.getIndex);
router.post("/feeds/api/get/all", feedController.feedsGetAll);
router.post("/feeds/api/update", feedController.feedsUpdate);
router.post("/feeds/api/add", feedController.feedsAdd);
router.post("/feeds/api/delete", feedController.deleteFeed);

//feed requirement page
router.get("/feeds/required", feedRequirementController.getIndex);
router.post("/feeds/required/api/get/all", feedRequirementController.feedsRequiredGetAll);
router.post("/feeds/required/api/get/adgs", feedRequirementController.getADGS);
router.post("/feeds/required/api/get/weights", feedRequirementController.getWeights);

//feed and ration calculator
router.get("/feeds/calculator", feedCalculator.getIndex);
router.post("/feeds/calculator/api/setdefault", feedCalculator.feedSetDefault);


module.exports = router;