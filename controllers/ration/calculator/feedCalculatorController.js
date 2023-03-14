const pool = require('../../../services/mysql');

/**
* @desc get ration calculator index page 
* @route POST /ration/feeds/calculator
* @access public // later on admin only
*/
exports.getIndex =  async (req, res) => {
    await res.status(200).render('ration/calculator/index', {});
};



/**
* @desc set default feed
* @route POST /feeds
* @access public // later on admin only
*/
exports.feedSetDefault = async (req, res) => {

    pool.query('call feedSetDefault(?,?)', 
        [
            req.body.id,
            req.body.is_default
        ], 
        await function(err, results, fields) {
             
            if(err) throw err;
            
            let is_changed = results.affectedRows > 0 ? true : false;            

            return res.json(is_changed);
        }
    );  
};
