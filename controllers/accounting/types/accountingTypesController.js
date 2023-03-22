const pool = require('../../../services/mysql');

/**
* @desc get all accounting types 
* @route POST accounting/types
* @access public // later on admin only
*/
exports.getIndex = async (req, res) => {
    await res.status(200).render('accounting/types/index', {});
};


/**
* @desc selects transaction categories
* @route POST /accounting/categories/api/get/all
* @access public // later on admin only
*/
exports.getTransactionCategories = async (req, res) => {

    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call transactionCatGetAll()', []);      
        
        let categories = results[0];

        for(let i = 0; i < categories.length; i++){
            req.body.parent_id = categories[i].id;   

            categories[i].sub_category = await exports.getTransactionSubCategories(req, res);
        }

        return res.json( categories );
    }
    catch (err){ throw err; }
        //res.status(500).json({ error : err}) };
};


/**
* @desc adds new budget
* @route POST ""
* @access public // later on admin only
*/
exports.getTransactionSubCategories = async (req, res) => {

    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call transactionCatGetAllSubs(?)', 
        [
            req.body.parent_id
        ]);                    

        // commented out for a future reference, don't need it now
        //---------------------------------------------------------------------
        // let subCategories = results[0];

        // for(let i = 0; i < subCategories.length; i++){
        //     if(subCategories[i].category_description === undefined || subCategories[i].category_description === null)
        //     subCategories[i].category_description = '';
        // }
        //----------------------------------------------------------------------

        return results[0];
    }
    catch (err){ throw err; };
};


/**
* @desc adds new or saves old category or sub category information
* @route POST /accounting/categories/api/save
* @access public // later on admin only
*/
exports.saveTransactionCategory = async (req, res) => {
  
    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call transactionCatSave(?,?,?,?)', 
        [
            req.body.category_item.id,
            req.body.category_item.parent_id,
            req.body.category_item.category_name,
            req.body.category_item.category_description               
        ]);              

        let is_changed = results.affectedRows > 0 ? true : false;            

        return res.json(is_changed);
    }
    catch (err){ throw err; }
        //res.status(500).json({ error : err}) };
};


/**
* @desc remove existing category or sub category
* @route POST /accounting/categories/api/delete
* @access public // later on admin only
*/
exports.deleteTransactionCategory = async (req, res) => {   

    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call transactionCatDelete(?)', 
        [
            req.body.id
        ]);              

        let is_changed = results.affectedRows > 0 ? true : false;            

        return res.json(is_changed);
    }
    catch (err){ throw err; }
        //res.status(500).json({ error : err}) };
};


