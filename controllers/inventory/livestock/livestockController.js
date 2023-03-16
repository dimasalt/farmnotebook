const pool = require('../../../services/mysql');

/**
* @desc get livestock index page 
* @route POST /ration/feeds
* @access public // later on admin only
*/
exports.getIndex = async (req, res) => {

    await res.status(200).render('inventory/livestock/index', {});
};


/**
* @desc get list of livestock inventory
* @route POST /inventory/livestock/get/all
* @access public // later on admin only
*/
exports.getLivestockInventory = async (req, res) => {

    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call livestockGetAll(?,?,?)', 
            [
                req.body.current_page,
                req.body.records,
                req.body.is_active
            ]);      

        return res.json(results[0]);
    }
    catch (err){ res.status(500).json({ error : err}) };
};
