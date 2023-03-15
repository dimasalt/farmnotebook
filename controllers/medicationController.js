const pool = require('../services/mysql');

/**
* @desc get all contacts 
* @route POST /api/get/all
* @access public // later on admin only
*/
exports.getIndex = async (req, res) => {
    await res.status(200).render('medication/index', {});
};


/**
* @desc get all contacts 
* @route GET /contacts
* @access public // later on admin only
*/
exports.medicationGetAll = async (req, res) => {

    pool.query('call medicationGetAll(?)', 
        [
            req.body.search_term
        ], 
        await function(err, results, fields) {
              
            return res.json(results[0]);
        }
    );  
};


/**
 * @description adds new contact
 * @route /api/add
 * @access private
 */
exports.medicationAdd = async (req, res) => {
    pool.query('call medicationAdd(?,?,?,?,?)', 
        [      
            req.body.name,             
            req.body.desc,
            req.body.instruction,
            req.body.price,
            req.body.on_hand_doses           
        ], 
        await function(err, results, fields) {                 

            if(err) throw err;           

            let is_changed = results.affectedRows > 0 ? true : false;            

            return res.json({result : is_changed});
        }
    );        
};



/**
 * @description adds new contact
 * @route /api/add
 * @access private
 */
exports.medicationUpdate = async (req, res) => {
    pool.query('call medicationUpdate(?,?,?,?,?,?)',
        [      
            req.body.id,
            req.body.name,             
            req.body.desc,
            req.body.instruction,
            req.body.price,
            req.body.on_hand_doses           
        ], 
        await function(err, results, fields) {                 

            if(err) throw err;           

            let is_changed = results.affectedRows > 0 ? true : false;            

            return res.json({result : is_changed});
        }
    );        
};


/**
 * @description adds new contact
 * @route /api/add
 * @access private
 */
exports.medicationDelete = async (req, res) => {
    pool.query('call medicationDeleteOne(?)', 
        [      
            req.body.id
        ], 
        await function(err, results, fields) {                 

            if(err) throw err;           

            let is_changed = results.affectedRows > 0 ? true : false;            

            return res.json({result : is_changed});
        }
    );        
};


