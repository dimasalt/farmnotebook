const pool = require('../services/mysql');

/**
* @desc get all contacts 
* @route POST /api/get/all
* @access public // later on admin only
*/
exports.getIndex = (req, res) => {
    res.status(200).render('contacts/index', {});

};



/**
* @desc get all contacts 
* @route GET /contacts
* @access public // later on admin only
*/
exports.contactsGetAll = (req, res) => {

    pool.query('call contactsGetAll(?,?,?,?,?)', 
        [
            req.body.search_term, 
            req.body.contact_type, 
            req.body.contact_order_by,
            req.body.current_page,
            req.body.limit
        ], 
        function(err, results, fields) {
                // let contact_order_by = req.body.contact_order_by;
                // console.log(contact_order_by);
                return res.json(results[0]);
        }
    );     
};


/**
 * @description adds new contact
 * @route /api/add
 * @access private
 */
exports.contactAdd = (req, res) => {
    pool.query('call contactAdd(?,?,?,?,?,?)', 
        [ 
            req.body.name, 
            req.body.address,
            req.body.phone,
            req.body.email,
            req.body.note,
            req.body.contact_type      
        ], 
        function(err, results, fields) {                 

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
exports.contactUpdate = (req, res) => {

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
        function(err, results, fields) {                 

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
exports.deleteContact = (req, res) => {
    pool.query('call contactDeleteOne(?)', 
        [ 
            req.body.id          
        ], 
        function(err, results, fields) {                 

            if(err) throw err;           

            let is_changed = results.affectedRows > 0 ? true : false;            
            return res.json(is_changed);
        }
    );        
};


/**
 * @description gets vendors list from contacts
 * @route /api/get/vendors
 * @access private
 */
exports.getVendorList = (req, res) => {

};