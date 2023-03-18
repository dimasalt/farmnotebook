const pool = require('../../../services/mysql');


/**
* @desc get all accounting types 
* @route POST accounting/types
* @access public // later on admin only
*/
exports.getIndex = async (req, res) => {
    await res.status(200).render('accounting/budget/index', {}); 
};


/**
* @desc get budget list for dropdowns 
* @route POST accounting/budget/api/get/all
* @access public // later on admin only
*/
exports.getBudgetsList = async (req, res) => {

    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call budgetGetMainAll()', []);       

        return res.json(results[0]);      
    }
    catch (err){ res.status(500).json({ error : err}) };
};


/**
* @desc get specific budget
* @route POST accounting/budget/api/get/single
* @access public // later on admin only
*/
exports.getBudgetSingle = async (req, res) => {

    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call budgetGetAll(?)', [
            req.body.id
        ]);              

        return res.json(results[0]);      
    }
    catch (err){ res.status(500).json({ error : err}) };
};


/**
* @desc adds new budget
* @route POST accounting/budget/api/add/new
* @access public // later on admin only
*/
exports.addBudgetNew = async (req, res) => {

    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call budgetCreate(?,?,?,?,?,?,?)', 
        [
            req.body.parent_id,
            req.body.budget_name,
            req.body.budget_amount,
            req.body.budget_amount_actual,
            req.body.is_done,
            req.body.is_default,
            req.body.budget_date
        ]);              

        let is_changed = results.affectedRows > 0 ? true : false;            

        return res.json(is_changed);
    }
    catch (err){ res.status(500).json({ error : err}) };
};



/**
* @desc adds new budget
* @route POST accounting/budget/api/delete
* @access public // later on admin only
*/
exports.deleteBudget = async (req, res) => {
  
    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call budgetDelete(?)', 
        [
            req.body.id          
        ]);              

        let is_changed = results.affectedRows > 0 ? true : false;            

        return res.json(is_changed);
    }
    catch (err){ res.status(500).json({ error : err}) };
};



/**
* @desc adds new budget
* @route POST accounting/budget/api/update
* @access public // later on admin only
*/
exports.updateBudget = async (req, res) => {
  
    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call budgetUpdate(?,?,?,?,?)', 
        [
            req.body.id,
            req.body.budget_name,
            req.body.budget_amount,
            req.body.budget_amount_actual,
            req.body.budget_date
        ]);              

        let is_changed = results.affectedRows > 0 ? true : false;            

        return res.json(is_changed);
    }
    catch (err){ res.status(500).json({ error : err}) };
};



/**
* @desc adds new budget
* @route POST accounting/budget/api/status/update
* @access public // later on admin only
*/
exports.updateBudgetStatus = async (req, res) => {
  
    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call budgetUpdateStatus(?,?)', 
        [
            req.body.id,
            req.body.is_done
        ]);              

        let is_changed = results.affectedRows > 0 ? true : false;            

        return res.json(is_changed);
    }
    catch (err){ res.status(500).json({ error : err}) };
};