const hasAccess = (req, res, next) =>{

    let is_valid = true;

    if(is_valid) {
        res.status(200);
         
        //console.log('middleware');
        next();
    }
};

module.exports = { hasAccess };