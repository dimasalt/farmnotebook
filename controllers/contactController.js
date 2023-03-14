const pool = require('../services/mysql');

/**
* @desc get all contacts 
* @route POST /api/get/all
* @access public // later on admin only
*/
exports.getIndex = async (req, res) => {
    await res.status(200).render('contacts/index', {});
};



/**
* @desc get all contacts 
* @route GET /contacts
* @access public // later on admin only
*/
exports.contactsGetAll = async (req, res) => {

    pool.query('call contactsGetAll(?,?,?,?,?)', 
        [
            req.body.search_term, 
            req.body.contact_type, 
            req.body.contact_order_by,
            req.body.current_page,
            req.body.limit
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
exports.contactAdd = async (req, res) => {
    pool.query('call contactAdd(?,?,?,?,?,?)', 
        [ 
            req.body.name, 
            req.body.address,
            req.body.phone,
            req.body.email,
            req.body.note,
            req.body.contact_type      
        ], 
        await function(err, results, fields) {                 

            if(err) throw err;           

            let is_changed = results.affectedRows > 0 ? true : false;            

            return res.json(is_changed);
        }
    );        
};


/**
 * @description updates existing contact
 * @route /api/update
 * @access private
 */
exports.contactUpdate = async (req, res) => {

    pool.query('call contactUpdate(?,?,?,?,?,?,?)', 
        [ 
            req.body.id,
            req.body.name, 
            req.body.address,
            req.body.phone,
            req.body.email,
            req.body.note,
            req.body.contact_type      
        ], 
        await function(err, results, fields) {                 

            if(err) throw err;           

            let is_changed = results.affectedRows > 0 ? true : false;            

            return res.json(is_changed);
        }
    );        
};


/**
 * @description removes contact
 * @route /api/delete
 * @access private
 */
exports.deleteContact = async (req, res) => {
    pool.query('call contactDeleteOne()', 
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


/**
 * @description: gets vendors list from contacts
 * @route: /api/get/vendors
 * @params: none
 * @access: private
 */
exports.getVendorList = async(req, res) => {
    pool.query('call contactVendorsGetAll()', [], 
        
        await function(err, results, fields) {                 

            if(err) throw err;           

            return res.json(results[0]);
        }
    );        
};