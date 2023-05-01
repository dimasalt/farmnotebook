const pool = require('../../../services/mysql');

/**
* @desc get reports main page 
* @route POST /api/get/all
* @access public // later on admin only
*/
exports.getIndex = async (req, res) => {
    await res.status(200).render('accounting/reports/index', {});
};


/**
* @desc get reports monthly numbers
* @route POST /accounting/reports/api/get/monthly
* @access public // later on admin only
*/
exports.getMonthlyReports = async (req, res) => {

    let result = [];
    let months = req.body.months;

    //const promisePool = pool.promise();
    try{
        const promisePool = pool.promise();
        
        for(let i = 0; i < months.length; i++){
         
            const [results,fields] = await promisePool.query('call reportsGetMonthly_new(?,?,?,?)', [
                months[i].month,
                months[i].year,
                req.body.category_selected,
                req.body.sub_category_selected
            ]); 
            
            //console.log(results);
            result.push(results[0][0]);            
        }      

        return res.json(result);      
    }
    catch (err){  
        res.status(500).json({ error : err});
        //throw err;
    }
        
};

/**
* @desc get reports monthly numbers for the fuel
* @route POST /accounting/reports/api/get/monthly/fuel
* @access public // later on admin only
*/
exports.getMonthlyReportsFuel = async (req, res) => {

    let result = [];
    let months = req.body.months;

    try{
        const promisePool = pool.promise();

        for (let i = 0; i < months.length; i++){
                      
            const [results,fields] = await promisePool.query('call reportsGetMonthlyFuel(?,?)', [
                months[i].month,
                months[i].year
            ]);    
            
            result.push(results[0][0]);
        }

        return res.json(result);      
    }
    catch (err){  res.status(500).json({ error : err}) };
};

