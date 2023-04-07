const multer = require('multer');
const path = require('path');
const fs = require('fs');


const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {

         //date format folders (year, month , day)
         let dateSplit = req.body.transaction_date.split('T');
         let year = dateSplit[0].split('-')[0];
         let month = dateSplit[0].split('-')[1];
         let day = dateSplit[0].split('-')[2];         
 
         let filePath = path.join(__dirname, '..', 'public', 'uploads', 'transactions', year, month, day);

         //create a path for the uploaded file
         try {
            if(!fs.existsSync(filePath))
                fs.mkdirSync(filePath, {recursive: true});             

               //assign date path part for the file 
               req.body.year = year;
               req.body.month = month;
               req.body.day = day;
        }
        catch (err) {}

        cb(null, filePath);
    },
    filename : (req, file, cb) => {       

        //get extention and create new file name
        let fileExtentionName = path.extname(file.originalname);        
        let newFileName = req.body.vendor_name.split(' ').join('_') + '-' + req.body.transaction_id + fileExtentionName;    
        
        //convert to lower case
        newFileName = newFileName.toLowerCase();  
        
        //preping full path for transaction image to be sent to receipt upload controller
        req.body.trans_image = path.join('uploads', 'transactions', req.body.year, req.body.month, req.body.day, newFileName);               
         
        cb(null, newFileName);
    }                            
});

//filter files that are good and not good
const fileFilter = (req, file, cb) => {
    let file_extention = path.extname(file.originalname).toLowerCase();        

    // Array of allowed files
    const array_of_allowed_files = ['.png', '.jpeg', '.jpg', '.gif', '.pdf'];
    const array_of_allowed_file_types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'application/pdf'];
    const allowed_file_size = 2; //size in mb


    // Check if the uploaded file is allowed
    if (!array_of_allowed_files.includes(file_extention) || !array_of_allowed_file_types.includes(file.mimetype)) {
        console.log('Invalid file');
        return false;                      
        //cb(null, false);
    }

    if ((file.size / (1024 * 1024)) > allowed_file_size) {                  
        console.log('File too large');
        cb(null, false);
    }

    // To reject this file pass `false`, like so:
    //cb(null, false)

    // To accept the file pass `true`, like so:
    cb(null, true)

    // You can always pass an error if something goes wrong:
    //cb(new Error('I don\'t have a clue!'))
};


const upload = multer({ storage : fileStorageEngine, fileFilter : fileFilter });

module.exports = upload;

/**
 * ------------------------------------------------------------------------------
 * We don't need to check for existing file as new upload will override
 * any file with the same filename
 * -------------------------------------------------------------------------------
 *  // another way to get file extention name
    // const ext = file.filename
    // .split('.')
    // .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
    // .slice(1)
    // .join('.');
 * -------------------------------------------------------------------------------
 */