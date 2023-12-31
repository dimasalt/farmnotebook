const vehiclebooklogs = {
    data() {
        return {
            odometer : {
                total_km : 0,
                total_business_km : 0       
            },
            odometer_item : {
                id: 0,
                year_start_odometer : 0,
                year_end_odometer : 0,
                vehicle_desc : '',
                is_addoredit : false                
            },
            booklogs: [],  
            booklog_item : {
                vehicle_log_book_id : 0,
                destination : '',
                address : '',
                purpose : '',
                travel_distance : 0,
                travel_date : '',
                is_new : false
            },  
            booklog_del_item_id : 0,       
            booklog_date: '',
            booklogs_pager: [],
            
            page_name : 'Vehicle Log Book'
        }
    },   
    created () { 
        var self = this;

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        //format is yyyy/mm/dd
        self.booklog_date = yyyy + '-01-01';
        // self.end_date = yyyy + '-12-01';

        //booklogitem
        self.booklog_item.travel_date = yyyy + '-' + mm + '-' + dd;

        self.getOdometer(); //get year start and end odometer      
    },
    methods: {    
        getOdometer() {
             //gets all project items
             var self = this;   
             
             //reset odometer and booklog items that belong to this odometer
             self.odometer = {};
             self.booklogs = [];
    
             //prepare data
             var data = {booklog_date : self.booklog_date};
     
             var odometerReadings = $.post("/accounting/vehiclelogbook/api/get", data);
     
             odometerReadings.done(function (data) {
                 if (JSON.stringify(data) !== '{}') {             
                     
                     self.odometer = data;

                     self.getBookLogItems();
                     self.odometer_item.is_addoredit = false;

                     //calculate total km
                     self.odometer.total_km = parseInt(self.odometer.year_end_odometer) - parseInt(self.odometer.year_start_odometer);                                             
                }
                else self.odometer_item.is_addoredit = true;            
             });
     
             odometerReadings.always(function () { });
        },
        getBookLogItems () {           
            var self = this;          
            
            //reset booklog records and business distance totals
            self.booklogs = [];
            self.odometer.total_business_km = 0;
    
            //prepare data
            var data = {odometer_id : self.odometer.id};   
            var projectsList = $.post("/accounting/vehiclelogbook/api/get/items", data);
    
            projectsList.done(function (data) {
                if (data.length > 0) {        
                                        
                    self.booklogs = data;

                    //hidde new item form in case new item has just been added
                    self.booklog_item.is_new = false;

                    for(var i = 0; i < self.booklogs.length; i++){
                        self.odometer.total_business_km = parseInt(self.odometer.total_business_km ) + parseInt(self.booklogs[i].travel_distance);
                    }
                }
            });
    
            projectsList.always(function () { });
        },     
        /**
         * -------------------------------------------------------
         * add or edit odometer reading for specific year
         * --------------------------------------------------------
         */
        vehicleAddOrEditOdometer(){
            var self = this;            
            
            var data = {odometer : self.odometer_item};
            data.created_at = self.booklog_date;
            var odometerNew = $.post("/accounting/vehiclelogbook/api/add", data);
    
            odometerNew.done(function (data) {           
                if(data == true){
                    //Display a success toast, with a title
                    toastr.success("You have successfully added new odometer to a records");      
                    
                    //pull new odometer record
                    self.getOdometer();
                }
                else {
                    // Display an error toast, with a title
                    toastr.error("Ops! There appears to be an error and odometer coudln't be added");
                }               
                
                
                //reset odometer_item
                self.odometer_item = {
                    id: 0,
                    year_start_odometer : 0,
                    year_end_odometer : 0,
                    vehicle_desc : '',
                    is_addoredit : false       
                };
            });
     
            odometerNew.always(function () { });
        },     
         /**
         * -------------------------------------------------------
         * show odometer form
         * --------------------------------------------------------
         */
        showOdometerForm(){
            var self = this;
            
            //copy odometer values without linking original values with changed ones
            self.odometer_item = Object.assign({}, self.odometer );

            //show form
            self.odometer_item.is_addoredit = true;
        },
          /**
         * -------------------------------------------------------
         * hide odometer form
         * --------------------------------------------------------
         */
        hideodometerForm(){
            var self = this;
        
             //reset odometer_item
             self.odometer_item = {
                id: 0,
                year_start_odometer : 0,
                year_end_odometer : 0,
                vehicle_desc : '',
                is_addoredit : false       
            };
        },
        /**
         * -------------------------------------------------------
         * remove odometer
         * --------------------------------------------------------
         */
        odometerDelModalShow(){
            var self = this;    

            //show the modal
            $('#deleteModal').modal('show');
        },
        odometerDelOne(){
            var self = this;    
            
            //show the modal
            $('#deleteModal').modal('hide');
            
            var data = {id : self.odometer.id};           
            var odometerDel = $.post("/accounting/vehiclelogbook/api/delete", data);
    
            odometerDel.done(function (data) {                
                if(data == true){
                    //Display a success toast, with a title
                    toastr.success("You have successfully removed an odometer from the records");      
                    
                    //select current year date 
                    var today = new Date();                       
                    var yyyy = today.getFullYear();
            
                    //format is yyyy/mm/dd
                    self.booklog_date = yyyy + '-01-01';                     
            
                    //get current year odometer                   
                    self.getOdometer();           
                }
                else {
                    // Display an error toast, with a title
                    toastr.error("Ops! There appears to be an error and odometer coudln't be removed");
                }                                                     
            });
     
            odometerDel.always(function () { });
        },
        showNewBooklogForm(status){
            var self = this;

            self.booklog_item.is_new = status;
        },       
        vehicleAddTravelRecord(){
            var self = this;          
            
            var data = {
                odometer_id : self.odometer.id,                
                booklog_item : self.booklog_item
            };                              
            var booklogAdd = $.post("/accounting/vehiclelogbook/api/item/add", data);
    
            booklogAdd.done(function (data) {                   
                if(data == true){
                    //Display a success toast, with a title
                    toastr.success("You have successfully added an logbook item from the records");  
                    
                    //load new record for display
                    self.getBookLogItems();
                }
                else if(data == false){
                    // Display an error toast, with a title
                    toastr.error("Ops! There appears to be an error and booklog item coudln't be added");
                }                                                      
                
                //reset booklog item
                self.resetVehicleBooklogItem();
            });
     
            booklogAdd.always(function () { });

        },
        /**
         * -------------------------------------------------------
         * remove odometer travel item
         * --------------------------------------------------------
         */
        showVehicleTravelItemModal(id){
            var self = this;    

            //get id of item to delete
            self.booklog_del_item_id = id;

            //show the modal
            $('#deletebooklogModal').modal('show');
        },
        deleteVehicleTravelItem(){
            var self = this;    
            
            //show the modal
            $('#deletebooklogModal').modal('hide');
            
            var data = {id : self.booklog_del_item_id};
            var odometerDel = $.post("/accounting/vehiclelogbook/api/item/delete", data);
    
            odometerDel.done(function (data) {            
                if(data == true){
                    //Display a success toast, with a title
                    toastr.success("You have successfully removed an odometer from the records");                                                
                }
                else if(data == false){
                    // Display an error toast, with a title
                    toastr.error("Ops! There appears to be an error and odometer coudln't be removed");
                }    
                
                //reset delete item id
                self.booklog_del_item_id = 0;

                //update list of displayed book log items
                self.getBookLogItems();                                          
            });
        
            odometerDel.always(function () { });
        },
        onYearChange()   {
            var self = this;     
            
            //reset existing items
            self.odometer = {};
            self.booklogs = [];

            //pull new information
            self.getOdometer();
        },
        /**
         * -------------------------------------------------------------
         * get page default settings
         * -------------------------------------------------------------
         */
        getPageDefaultSettings(){
            var self = this;

            //self.page_name
            var data = {page_name : self.page_name};           
            var odometerDel = $.post("/bookkeeping/vehiclelogbook/del/booklog", data);
    
            odometerDel.done(function (data) {
                if(data.length > 0){
                    if(data == true){
                        //Display a success toast, with a title
                        toastr.success("You have successfully removed an odometer from the records");                                                
                    }
                    else if(data == false){
                        // Display an error toast, with a title
                        toastr.error("Ops! There appears to be an error and odometer coudln't be removed");
                    }    
                    
                    //reset delete item id
                    self.booklog_del_item_id = 0;

                    //update list of displayed book log items
                    self.getBookLogItems();
                }                              
            });
        
            odometerDel.always(function () { });

        },
        /**
         * -------------------------------------------------------------
         * resets vehicle booklog item
         * -------------------------------------------------------------
         */
        resetVehicleBooklogItem(){
            var self = this;

            //get current date for travel date input field
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();                

            //reset booklog item
            self.booklog_item = {
                vehicle_log_book_id : 0,
                destination : '',
                address : '',
                purpose : '',
                travel_distance : 0,
                travel_date : yyyy + '-' + mm + '-' + dd,
                is_new : false
            }         
        },
        /**
         * ----------------------------------------------------------------
         * Reset odometer item
         * ----------------------------------------------------------------
         */
        resetOdometer(){
            var self = this;

            
        }
    }
};

const app = Vue.createApp(vehiclebooklogs)
                .mount('#vehiclelogbook');