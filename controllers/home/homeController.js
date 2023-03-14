const pool = require('../../services/mysql');

/**
* @desc get all contacts 
* @route POST /api/get/all
* @access public // later on admin only
*/
exports.getIndex = async (req, res) => {
    await res.status(200).render('home/index', {});
};
