const pool = require('../../../services/mysql');

/**
* @desc get all accounting types 
* @route POST accounting/types
* @access public // later on admin only
*/
exports.getIndex = async (req, res) => {
    await res.status(200).render('accounting/vehiclelogbook/index', {}); 
};
