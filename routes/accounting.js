const express = require('express');
const router = express.Router();

//budget controller
const accountingBudgetController = require('../controllers/accounting/budget/accountingBudgetController');

//vehicle log book controller
const vehicleLogBookController = require('../controllers/accounting/vehiclelogbook/vehicleLogBookController');

//accounting types/categories
const transactionTypesController = require('../controllers/accounting/types/accountingTypesController');

//transaction records controller
const transactionRecordsController = require('../controllers/accounting/records/transactionRecordsController');


const hasAccess = require('../midleware/user');
router.use('/', hasAccess.hasAccess);

//actual routes

//budget page routes
router.get("/budget", accountingBudgetController.getIndex);
router.post("/budget/api/get/all", accountingBudgetController.getBudgetsList);
router.post("/budget/api/get/single", accountingBudgetController.getBudgetSingle);
router.post("/budget/api/add/new", accountingBudgetController.addBudgetNew);
router.post("/budget/api/delete", accountingBudgetController.deleteBudget);
router.post("/budget/api/update", accountingBudgetController.updateBudget);
router.post("/budget/api/update/status", accountingBudgetController.updateBudgetStatus);


//vehicle log book routes
router.get("/vehiclelogbook", vehicleLogBookController.getIndex);
router.post("/vehiclelogbook/api/get", vehicleLogBookController.getOdometer);
router.post("/vehiclelogbook/api/get/items", vehicleLogBookController.getBookLogItems);
router.post("/vehiclelogbook/api/add", vehicleLogBookController.vehicleAddOrEditOdometer);
router.post("/vehiclelogbook/api/delete", vehicleLogBookController.deleteOdometer);
router.post("/vehiclelogbook/api/item/add", vehicleLogBookController.addVehicleTravelRecord);
router.post("/vehiclelogbook/api/item/delete", vehicleLogBookController.deleteVehicleTravelItem);


//transaction categories/types
router.get("/categories", transactionTypesController.getIndex);
router.post("/categories/api/get/all", transactionTypesController.getTransactionCategories);
router.post("/categories/api/save", transactionTypesController.saveTransactionCategory);
router.post("/categories/api/delete", transactionTypesController.deleteTransactionCategory);


//transaction records pages
router.get("/records", transactionRecordsController.getIndex);
router.post("/records/api/get/all", transactionRecordsController.getTransactionRecords);
router.post("/records/api/get/totals", transactionRecordsController.getTransactionTotals);
router.post("/records/api/add", transactionRecordsController.addTransactionRecord);
router.post("/records/api/delete", transactionRecordsController.deleteTransactionRecord);
router.post("/records/api/item/add", transactionRecordsController.addTransactionRecordItem);
router.post("/records/api/item/delete", transactionRecordsController.deleteTransactionRecordItem);




module.exports = router;