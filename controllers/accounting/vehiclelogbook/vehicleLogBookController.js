const pool = require('../../../services/mysql');

/**
* @desc get vehicle  log book index page
* @route POST accounting/types
* @access public // later on admin only
*/
exports.getIndex = async (req, res) => {
    await res.status(200).render('accounting/vehiclelogbook/index', {}); 
};



/**
* @desc gets odometer reading for selected year
* @route POST /accounting/vehiclelogbook/api/get
* @access public // later on admin only
*/
exports.getOdometer = async (req, res) => { 
        
    try {
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call vehicleGetOdometer(?)', 
            [ 
                req.body.booklog_date
            ]);                          

            //check if result is empty then return empty object if not return the object itself
            if(results && results[0].length == 0) return res.json({});
            else return res.json(results[0][0]);
    }
    catch (err){ res.status(500).json({ error : err}) };
};



/**
* @desc gets odometer reading for selected year
* @route POST /accounting/vehiclelogbook/api/get/items
* @access public // later on admin only
*/
exports.getBookLogItems = async (req, res) => { 
        
    try {
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call vehicleGetTravelRecords(?)', 
            [ 
                req.body.odometer_id
            ]);                           
           
            return res.json(results[0]);
    }
    catch (err){ res.status(500).json({ error : err}) };
};


/**
* @desc adds new odometer or edits the old one
* @route POST /accounting/vehiclelogbook/api/add
* @access public // later on admin only
*/
exports.vehicleAddOrEditOdometer = async (req, res) => { 
        
    try {
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call vehicleAddOrEditOdometer(?,?,?,?,?)', 
            [ 
                req.body.odometer.id,
                req.body.odometer.year_start_odometer,
                req.body.odometer.year_end_odometer,
                req.body.odometer.vehicle_desc,
                req.body.created_at              
            ]);                           
           
            let is_changed = results.affectedRows > 0 ? true : false;            

            return res.json(is_changed);
    }
    catch (err) { throw err; }
    //{ res.status(500).json({ error : err.stack}) };
};


/**
* @desc removes odometer
* @route POST /accounting/vehiclelogbook/api/delete
* @access public // later on admin only
*/
exports.deleteOdometer = async (req, res) => { 
    try {
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call vehicleDelOdometer(?)', 
            [          
                req.body.id
            ]);                           
           
            let is_changed = results.affectedRows > 0 ? true : false;            

            return res.json(is_changed);
    }
    catch (err) { throw err; }
    //{ res.status(500).json({ error : err.stack}) };
};


/**
* @desc adds a new odometer Item 
* @route POST /accounting/vehiclelogbook/api/add/item
* @access public // later on admin only
*/
exports.addVehicleTravelRecord = async (req, res) => { 
    try {
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call vehicleAddTravelRecord(?,?,?,?,?,?)', 
            [          
                req.body.odometer_id,
                req.body.booklog_item.destination,
                req.body.booklog_item.address,
                req.body.booklog_item.purpose,
                req.body.booklog_item.travel_distance,
                req.body.booklog_item.travel_date              
            ]);                           
           
            let is_changed = results.affectedRows > 0 ? true : false;            

            return res.json(is_changed);
    }
    catch (err) { throw err; }
    //{ res.status(500).json({ error : err.stack}) };
};


/**
* @desc removes specific booklog item 
* @route POST /accounting/vehiclelogbook/api/item/delete
* @access public // later on admin only
*/
exports.deleteVehicleTravelItem = async (req, res) => { 
    try {
        const promisePool = pool.promise();
        const [results,fields] = await promisePool.query('call vehicleDelTravelRecord(?)', 
            [          
                req.body.id
            ]);                           
           
            let is_changed = results.affectedRows > 0 ? true : false;            

            return res.json(is_changed);
    }
    catch (err) { throw err; }
    //{ res.status(500).json({ error : err.stack}) };
};
