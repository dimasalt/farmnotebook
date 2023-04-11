const pool = require('../../../services/mysql');

/**
* @desc get reports main page 
* @route POST /api/get/all
* @access public // later on admin only
*/
exports.getIndex = async (req, res) => {
    await res.status(200).render('accounting/reports/index', {});
};


/**
* @desc get reports monthly numbers
* @route POST /accounting/reports/api/get/monthly
* @access public // later on admin only
*/
exports.getMonthlyReports = async (req, res) => {
    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call reportsGetMonthly(?,?)', [
            req.body.start_date,
            req.body.end_date
        ]);              

        return res.json(results[0]);      
    }
    catch (err){  res.status(500).json({ error : err}) };
};

