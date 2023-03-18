const express = require('express');
const router = express.Router();

const accountingBudgetController = require('../controllers/accounting/budget/accountingBudgetController');


const hasAccess = require('../midleware/user');
router.use('/', hasAccess.hasAccess);

//actual routes
router.get("/budget", accountingBudgetController.getIndex);
router.post("/budget/api/get/all", accountingBudgetController.getBudgetsList);
router.post("/budget/api/get/single", accountingBudgetController.getBudgetSingle);
router.post("/budget/api/add/new", accountingBudgetController.addBudgetNew);
router.post("/budget/api/delete", accountingBudgetController.deleteBudget);
router.post("/budget/api/update", accountingBudgetController.updateBudget);
router.post("/budget/api/update/status", accountingBudgetController.updateBudgetStatus);

module.exports = router;