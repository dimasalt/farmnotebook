const pool = require('../../../services/mysql');

/**
* @desc get feeds index page 
* @route POST /ration/feeds
* @access public // later on admin only
*/
exports.getIndex =  async (req, res) => {
    await res.status(200).render('ration/feedrequirements/index', {});
};



/**
* @desc get list of all of feeds 
* @route POST /feeds
* @access public // later on admin only
*/
exports.feedsRequiredGetAll = async (req, res) => {

    pool.query('call feedGetRequirements(?,?,?)', 
        [
            req.body.adg,
            req.body.start_weight,
            req.body.end_weight
        ], 
        await function(err, results, fields) {
              
            if (err) throw err;

            return res.json(results[0]);
        }
    );  
};

/**
* @desc get list of all of ADGS grouped 
* @route POST /ration/feeds/required/api/get/adgs
* @access public // later on admin only
*/
exports.getADGS = async (req, res) => {

    pool.query('call feedGetRequirementsAdg()', [],

        await function(err, results, fields) {
              
            if (err) throw err;          

            return res.json(results[0]);
        }
    );  
};



/**
* @desc get list of all of availabe weights 
* @route POST /feeds
* @access public // later on admin only
*/
exports.getWeights = async (req, res) => {

    pool.query('call feedGetRequirementsWeight()', [], 
        
        await function(err, results, fields) {
              
            if (err) throw err;

            return res.json(results[0]);
        }
    );  
};



