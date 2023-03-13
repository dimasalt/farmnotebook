const pool = require('../../../services/mysql');

/**
* @desc get ration calculator index page 
* @route POST /ration/feeds/calculator
* @access public // later on admin only
*/
exports.getIndex =  async (req, res) => {
    await res.status(200).render('ration/calculator/index', {});
};
