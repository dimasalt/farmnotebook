const pool = require('../../services/mysql');

/**
* @desc get feeds index page 
* @route POST /ration/feeds
* @access public // later on admin only
*/
exports.getIndex = async (req, res) => {

    await res.status(200).render('inventory/types/index', {});
};


/**
* @desc get list of all types of animals 
* @route POST /inventory/types/get/all
* @access public // later on admin only
*/
exports.getTypes = async (req, res) => {

    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call livestockGetTypeAll()', []);

        const categories = results[0];

        for(let i = 0; i < categories.length; i++){                
            req.body.id = categories[i].id;                      
            categories[i].sub_items = await exports.getSubTypes(req, res);
        }

        return res.json(categories);      
    }
    catch (err){ res.status(500).json({ error : err}) };
};


/**
* @desc get list of alln sub types of animals 
* @route POST /inventory/subtypes/get/all
* @access public // later on admin only
*/
exports.getSubTypes = async (req, res) => { 
        
    try {
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call livestockGetSubTypeAll(?)', [ req.body.id ]);

        return results[0];
    }
    catch (err) {  throw err; }    
};


/**
* @desc saves selected category or adds a new one 
* @route POST /inventory/types/add
* @access public // later on admin only
*/
exports.saveTypes = async (req, res) => { 
            
    try {
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call livestockCatSave(?,?,?,?)', 
            [ 
                req.body.category_item.id,
                req.body.category_item.parent_id,
                req.body.category_item.category_name,
                req.body.category_item.category_description
            ]);            

            let is_changed = results.affectedRows > 0 ? true : false;            

            return res.json({result : is_changed});
    }
    catch (err) {  throw err; }    
};



/**
* @desc removes selected category or sub category
* @route POST /inventory/types/delete
* @access public // later on admin only
*/
exports.deleteTypes = async (req, res) => { 
        
    try {
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call livestockCatDelete(?)', 
            [ 
                req.body.category_id
            ]);            

            let is_changed = results.affectedRows > 0 ? true : false;            

            return res.json({result : is_changed});
    }
    catch (err) {  throw err; }    
};
