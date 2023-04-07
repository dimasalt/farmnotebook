const pool = require('../../../services/mysql');
const fs = require('fs');
const path = require('path');


/**
* @desc get all accounting types 
* @route POST accounting/types
* @access public // later on admin only
*/
exports.getIndex = async (req, res) => {
    await res.status(200).render('accounting/records/index', {}); 
};



/**
* @desc get transaction records for specific year
* @route POST /accounting/records/api/get/all
* @access public // later on admin only
*/
exports.getTransactionRecords = async (req, res) => {

    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call transactionsGetAll(?,?,?,?,?,?,?)', [
            req.body.search_term,
            req.body.category_selected,
            req.body.sub_category_selected,
            1,
            25,
            req.body.start_date,
            req.body.end_date      
        ]);   
        
        //get transactions sub items
        let transactions = results[0];

        for(let i = 0; i < transactions.length; i++){
            transactions[i].items = await exports.getTransactionRecordItems(
                transactions[i].id,
                req.body.category_selected, 
                req.body.sub_category_selected
            );

        
            //formating date to a readable date
            //transactions[i].trans_read_date = transactions[i].trans_date;
        }

        return res.json(results[0]);      
    }
    //catch (err){  res.status(500).json({ error : err}) };
    catch (err) { throw err; }
};



/**
* @desc get transaction items for specific transaction
* @route N/A
* @access public // later on admin only
*/
exports.getTransactionRecordItems = async (id, category_selected, sub_category_selected) => {

    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call transactionItemsGet(?,?,?)', [
            id,
            category_selected,
            sub_category_selected
        ]);              

        return results[0];      
    }
    catch (err){  res.status(500).json({ error : err}) };
};




/**
* @desc get transaction totals for selected dates and search criteria
* @route POST /accounting/records/api/get/all
* @access public // later on admin only
*/
exports.getTransactionTotals = async (req, res) => {

    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call transactionGetTotals(?,?,?,?,?)', [
            req.body.search_term,
            req.body.category_selected,
            req.body.sub_category_selected,
            req.body.start_date,
            req.body.end_date
        ]);              

        return res.json(results[0]);      
    }
    catch (err){  res.status(500).json({ error : err}) };
};



/**
* @desc adds new transaction 
* @route POST /accounting/record/api/add
* @access public // later on admin only
*/
exports.addTransactionRecord = async (req, res) => {
    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call transactionCreate(?,?,?,?,?)', 
        [
            req.body.vendor_name,
            req.body.vendor_address,
            req.body.trans_desc,
            req.body.trans_currency,
            req.body.trans_date                            
        ]);              

        let is_changed = results.affectedRows > 0 ? true : false;            

        return res.json(is_changed);
    }
    catch (err){ res.status(500).json({ error : err}) };
};


/**
* @desc deletes transaction 
* @route POST /accounting/record/api/delete
* @access public // later on admin only
*/
exports.deleteTransactionRecord = async (req, res) => {
    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call transactionDelete(?)', 
        [
            req.body.id
        ]);              

        let is_changed = results.affectedRows > 0 ? true : false;
        
        // if database record is removed and there is image exists 
        // then remove
        if(is_changed && req.body.trans_image.length > 0){

            let filePath = req.body.trans_image.split(path.sep).join('/');
            deleteFileRecursive(filePath);
        }

        return res.json(is_changed);
    }
    catch (err){ res.status(500).json({ error : err}) };
};


/**
* @desc adds new transaction item
* @route POST /accounting/record/api/item/add
* @access public // later on admin only
*/
exports.addTransactionRecordItem = async (req, res) => {  

    // manipulate some transaction information
    // we have to check true or false as string because javascript passes value as a string and not as a boolean
    if(req.body.is_expence === 'true') {
        req.body.is_expence = 1;
        req.body.amount = req.body.amount * (-1);
    }
    else req.body.is_expence = 0;

    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call transactionItemCreate(?,?,?,?,?,?,?,?,?,?)', 
        [
            req.body.transaction_id,
            req.body.item_name,
            req.body.item_desc,
            req.body.item_category,
            req.body.item_subcategory,
            req.body.amount,
            req.body.hst_tax,
            req.body.gst_tax,
            req.body.pst_tax,
            req.body.is_expence
        ]);              

        let is_changed = results.affectedRows > 0 ? true : false;            

        return res.json(is_changed);
    }
    catch (err){ res.status(500).json({ error : err}) };
};


/**
* @desc deletes transaction item
* @route POST /accounting/record/api/item/delete
* @access public // later on admin only
*/
exports.deleteTransactionRecordItem = async (req, res) => {
    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call transactionItemDelete(?)', 
        [
            req.body.id
        ]);              

        let is_changed = results.affectedRows > 0 ? true : false;            

        return res.json(is_changed);
    }
    catch(err) { throw err; }
    //catch (err){ res.status(500).json({ error : err}) };
};


/**
* @desc uploads image or pdf file with receipt scan for transaction
* @route POST /accounting/record/api/upload
* @access public // later on admin only
*/
exports.uploadTransactionRecordImage = async (req, res) => {  
    
    let fileName = req.file;    

    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call transactionUpdateImage(?,?)', 
        [
            req.body.transaction_id,
            req.body.trans_image                       
        ]);              

        let is_changed = results.affectedRows > 0 ? true : false;            
        
        // return path for an transaction image 
        // (code already has an id and upload status in dropzone script)
        return res.json({ trans_image: req.body.trans_image });
    }
    catch (err){ res.status(500).json({ error : err}) };      
};


/**
* @desc uploads image or pdf file with receipt scan for transaction
* @route POST /accounting/record/api/upload
* @access public // later on admin only
*/
exports.deleteTransactionRecordImage = async (req, res) => {      

    try{
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call transactionUpdateImage(?,?)', 
        [
            req.body.id,
            ''
        ]);              

        let is_changed = results.affectedRows > 0 ? true : false;       
        
        //remove physical file from disk
        if(is_changed === true){
            
            //convert path to universal unix path separator as it works in windows too
            let filePath = req.body.trans_image.split(path.sep).join('/');

            deleteFileRecursive(filePath);
        }

        return res.json(is_changed);
    }
    catch (err){ res.status(500).json({ error : err}) };    
};

/**
 * @description  removes physical file from the disk
 * @param filePath 
 * @access public // later admin only
 */
const deleteFileRecursive = function(filePath){    

    let fullPath = path.join(__dirname, '..', '..', '..', 'public', filePath);    
    
    // check if file // if yes remove
    if(fs.lstatSync(fullPath).isFile())
    {
        fs.unlinkSync(fullPath);
    }
    // otherwise if folder check if full, if not full remove
    else if(fs.lstatSync(fullPath).isDirectory())
    {
        // not checking if folder has files or other folders, because folder going 
        // to remove only empty folders
        try {      
            fs.rmdirSync(fullPath);
        } catch(error) {
            //not empty and we get an error
            //console.log(error);
            return;
        }
    }


    // generate new path minus last item to call function again
    let newFilePathArray = filePath.split('/');
    let popped = newFilePathArray.pop();

    // bigger than 1 because main upload folder is in the first place of array path
    if(newFilePathArray.length > 1) 
        deleteFileRecursive(newFilePathArray.join('/'));
    
};


