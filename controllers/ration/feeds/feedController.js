const pool = require('../../../services/mysql');

/**
* @desc get feeds index page 
* @route POST /ration/feeds
* @access public // later on admin only
*/
exports.getIndex = async (req, res) => {
    await res.status(200).render('ration/feeds/index', {});
};



/**
* @desc get list of all of feeds 
* @route POST /feeds
* @access public // later on admin only
*/
exports.feedsGetAll = async (req, res) => {

    pool.query('call feedGetAll()', [], 
        await function(err, results, fields) {
              
            return res.json(results[0]);
        }
    );  
};


/**
 * @description updates existing feed item
 * @route /ration/feeds/api/update
 * @access private
 */
exports.feedsUpdate = async (req, res) => {

    pool.query('call feedUpdate(?,?,?,?,?,?,?,?,?)', 
        [             
            req.body.feed_item.id,
            req.body.feed_item.feed_name, 
            req.body.feed_item.feed_desc,
            req.body.feed_item.feed_cp,
            req.body.feed_item.feed_tdn,
            req.body.feed_item.feed_type,
            req.body.feed_item.feed_price,
            req.body.feed_item.feed_price_lb,
            req.body.feed_item.feed_usage       
        ], 
        await function(err, results, fields) {                 

            if(err) throw err;           
            
            let is_changed = results.affectedRows > 0 ? true : false;            

            return res.json(is_changed);
        }
    );        
};


/**
 * @description adds new feed
 * @route /ration/feeds/api/add
 * @access private
 */
exports.feedsAdd = async (req, res) => {
    pool.query('call feedCreate(?,?,?,?,?,?,?,?)', 
        [ 
            req.body.feed_item.feed_name, 
            req.body.feed_item.feed_desc,
            req.body.feed_item.feed_cp,
            req.body.feed_item.feed_tdn,
            req.body.feed_item.feed_type,
            req.body.feed_item.feed_price,
            req.body.feed_item.feed_price_lb,
            req.body.feed_item.feed_usage       
        ], 
        await function(err, results, fields) {                 

            if(err) throw err;           

            let is_changed = results.affectedRows > 0 ? true : false;            

            return res.json(is_changed);
        }
    );        
};



/**
 * @description removes feed item
 * @route /ration/feed/api/delete
 * @access private
 */
exports.deleteFeed = async (req, res) => {
    pool.query('call feedDeleteOne(?)', 
        [ 
            req.body.id          
        ], 
        await function(err, results, fields) {                 

            if(err) throw err;                     

            let is_changed = results.affectedRows > 0 ? true : false;        

            return res.json(is_changed);
        }
    );        
};

