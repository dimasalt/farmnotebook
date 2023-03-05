const transactions = {
    data() {
        return {
            transactions: [],           
            transaction_record : {},
            transaction_item : {},
            vendors : [], 

            start_date : new Date().getFullYear()  + '-01-01', //format yyyy + '-' + mm + '-' + dd;
            end_date:  new Date().getFullYear()  + '-12-31', //format yyyy + '-' + mm + '-' + dd;
            category_selected : '',
            sub_category_selected : '',
            transaction_category : [],
            transaction_sub_category : [],
            transaction_sub_category_disabled : true,
            search_term : '',
            
            action : {},
            
            //transactions totals for selected period of time and according to search terms
            transaction_totals : {
                // total_expences : 0,
                // total_income : 0,
                // total_feed_expences : 0,
                // total_cattle_expences : 0,
                // total_veterinary_expences : 0,
                // total_gasoline_expences : 0
            }
        }
    },   
    created () { 
        var self = this;

        //reset transaction record and item 
        self.resetVariables();

        //get all transactions     
        self.transactionsGetAll(); 

        //get transaction categories
        self.getCategories();

        //get all vendors
        self.vendorsGetAll();
    },
    methods: {    
        /**
         * if seach term changed get new records list
         */
        goSearch() {
            var self = this;
           
            self.transactionsGetAll();
        },
        transactionsGetAll () {
            //gets all project items
            var self = this;             
    
            //prepare data object 
            //includes search term, date and selected categories and sub categories
            var data = {
                search_term : self.search_term, 
                category_selected : self.category_selected,
                sub_category_selected: self.sub_category_selected,
                start_date: self.start_date, 
                end_date :  self.end_date 
            };

            data = JSON.stringify(data);
    
            var result = $.post("/bookkeeping/records/get/all", data);
    
            result.done(function (data) {
                if (data.length > 0) {
                    data = JSON.parse(data);                  
                    
                    self.transactions = data;

                    // for(var i = 0; i < self.transactions.length; i++){
                    //     for(var y = 0; y < self.transactions[i].items.length; y++){
                    //         if(self.transactions[i].items[y].is_expence == 1){

                    //             var amount = self.transactions[i].items[y].amount;
                    //             self.transaction_totals.total_expences = Number(self.transaction_totals.total_expences) + Number(amount);

                    //             if(self.transactions[i].items[y].item_category == 'Feed'){
                    //                 var feed_expences = self.transactions[i].items[y].amount;
                    //                 self.transaction_totals.total_feed_expences = Number(self.transaction_totals.total_feed_expences) + Number(feed_expences);
                    //             }
                    //             else if(self.transactions[i].items[y].item_category == 'Livestock'){
                    //                 if(self.transactions[i].items[y].item_subcategory == 'Cattle'){
                    //                     var catle_expences = self.transactions[i].items[y].amount;
                    //                     self.transaction_totals.total_cattle_expences = Number(self.transaction_totals.total_cattle_expences) + Number(catle_expences);   
                    //                 }
                    //             }                                
                    //             else if(self.transactions[i].items[y].item_category == 'Veterinary'){
                    //                 var vet_expences = self.transactions[i].items[y].amount;
                    //                 self.transaction_totals.total_veterinary_expences = Number(self.transaction_totals.total_veterinary_expences) + Number(vet_expences);   
                    //             }
                    //             else if(self.transactions[i].items[y].item_category == 'Vehicle'){
                    //                 if(self.transactions[i].items[y].item_subcategory == 'Gasoline'){
                    //                     var total_gasoline_expences = self.transactions[i].items[y].amount;
                    //                     self.transaction_totals.total_gasoline_expences = Number(self.transaction_totals.total_gasoline_expences) + Number(total_gasoline_expences);   
                    //                 }
                    //             }                                                                              
                    //         }  
                    //         else {
                    //             var amount = self.transactions[i].items[y].amount;
                    //             self.transaction_totals.total_income = Number(self.transaction_totals.total_income) + Number(amount);
                    //         }                          
                    //     }
                    // }

                    //get transaction totals
                    self.transactionsGetTotals();                         
                }
            });
    
            result.always(function () { });
        },
        /**
         * -----------------------------------------------------------------------------------------------
         * function to get totals for all transactions based on selected category,
         * date and search term
         * ----------------------------------------------------------------------------------------------
         */
        transactionsGetTotals () {
            //gets all project items
            var self = this;   
            
            //reset totals
            self.transaction_totals = {
                total_expences : 0,
                total_income : 0,
                total_feed_expences : 0,
                total_cattle_expences : 0,
                total_veterinary_expences : 0,
                total_gasoline_expences : 0,
                total_equipment : 0,
                total_profit : 0
            }
    
            //prepare data object 
            //includes search term, date and selected categories and sub categories
            var data = {
                search_term : self.search_term, 
                category_selected : self.category_selected,
                sub_category_selected: self.sub_category_selected,
                start_date: self.start_date, 
                end_date :  self.end_date 
            };

            data = JSON.stringify(data);
    
            var result = $.post("/bookkeeping/records/get/totals", data);
    
            result.done(function (data) {
                if (data.length > 0) {
                    data = JSON.parse(data);                  
                    
                    self.transaction_totals = data[0];       
                    
                     //draw chart
                     self.barChartTotalsJS();
                     self.barChartPercentageJS();              
                }
            });
    
            result.always(function () { });
        },
        /**
         * -------------------------------------------------------------
         * get vendor list
         * -------------------------------------------------------------
         */
        vendorsGetAll(){
            var self = this;

              //gets all project items
              var self = this;           
    
              var data = {};
  
              data = JSON.stringify(data);
      
              var result = $.post("/contacts/getVendors", data);
      
              result.done(function (data) {
                  if (data.length > 0) {
                      data = JSON.parse(data);                         
                      
                      self.vendors = data;
                  }
              });
      
              result.always(function () { });
        },
        /**
         * -------------------------------------------------------------
         * remove transaction image receipt
         * -------------------------------------------------------------
         */
        transactionImageRemove(){
          
            //gets all project items
            var self = this;           
    
            var data = {
                id : self.transaction_record.id, 
                trans_image :  self.transaction_record.trans_image,
                csrf : $('#csrf').val() 
            };

            data = JSON.stringify(data);
    
            var result = $.post("/bookkeeping/records/receipt/remove", data);
    
            result.done(function (data) {
                data = JSON.parse(data);              

                if (data == true) {   
                                                
                    //reset transaction record and item 
                    self.resetVariables();

                    //get updated list of transactions
                    self.transactionsGetAll();

                    //Display a success toast, with a title
                    toastr.success("You have successfully have remove transaction receipt image");                                              
                }
                else if(data == false){
                    // Display an error toast, with a title
                    toastr.error("Ops! There appears to be an error and selected transaction receipt image couldn't be removed");
                }
            });
    
            result.always(function () { });
        
        },
        /**
         * -------------------------------------------------------------
         * transaction image englarge view
         * -------------------------------------------------------------
         */
        receiptPreview(){
            $('#img_preview_modal').attr('src', $('#img_preview_link').attr('src'));
			$('#imagePreviewModal').modal('show');   
        },
        /**
         * -------------------------------------------------------------
         * get transaction categories
         * -------------------------------------------------------------
         */
        getCategories (){
            var self = this;

            var data = {};
            data = JSON.stringify(data);
    
            var result = $.post("/bookkeeping/categories/get/all", data);
    
            result.done(function (data) {
                if (data.length > 0) {
                    
                    data = JSON.parse(data);                  

                    self.transaction_category.push({id: '0', category_name : ''});
                    for (var i = 0; i < data.length; i++)
                        self.transaction_category.push(data [i]);
                    
                        
                    self.transaction_category_selected = self.transaction_category[0].id;
                }                
            });
    
            result.always(function () { });
        },
        /**
         * -----------------------------------------------------------------
         * get transaction sab categories
         * -----------------------------------------------------------------
         */
        getSubCategories (){
            var self = this;

            var data = {};
            data = JSON.stringify(data);
    
            var result = $.post("/bookkeeping/categories/get/all", data);
    
            result.done(function (data) {
                if (data.length > 0) {
                    
                    data = JSON.parse(data);                  

                    self.transaction_category.push({id: '0', category_name : ''});
                    for (var i = 0; i < data.length; i++)
                        self.transaction_category.push(data [i]);
                    
                        
                    self.transaction_category_selected = transaction_category[0].id;
                }                
            });
    
            result.always(function () { });
        },
        /**
         * -----------------------------------------------------------
         * adds main transaction item
         * -----------------------------------------------------------
         */
        transactionAdd(){
            var self = this;
                
            var data = self.transaction_record;
            data = JSON.stringify(data);

            var result = $.post("/bookkeeping/records/add", data);
    
            result.done(function (data) {
                if (data.length > 0) {
                    
                    data = JSON.parse(data);   
                    
                    if (data == true) {   
                                                
                        //reset transaction record and item 
                        self.resetVariables();

                        //get updated list of transactions
                        self.transactionsGetAll();

                        //Display a success toast, with a title
                        toastr.success("You have successfully have added a main transaction item");                                              
                    }
                    else if(data == false){
                        // Display an error toast, with a title
                        toastr.error("Ops! There appears to be an error and selected main transaction coudln't be removed");
                    }
                    
                }                
            });
    
            result.always(function () { });
        },
        /**
         * --------------------------------------------------------------------------------------
         * add item to main transaction record
         * ---------------------------------------------------------------------------------------
         */
         transactionItemAdd(){
             var self = this;

            var data = self.transaction_item;
            data = JSON.stringify(data);

            var result = $.post("/bookkeeping/record/item/add", data);
    
            result.done(function (data) {
                if (data.length > 0) {
                    
                    data = JSON.parse(data);   
                    
                    if (data == true) {   
                                           
                        //reset form values                        
                        self.resetVariables();

                        //get updated list of transactions
                        self.transactionsGetAll();

                        //Display a success toast, with a title
                        toastr.success("You have successfully have added a main transaction item");                                              
                    }
                    else if(data == false){
                        // Display an error toast, with a title
                        toastr.error("Ops! There appears to be an error and selected main transaction coudln't be removed");
                    }
                    
                }                
            });
    
            result.always(function () { });
         },
           /**
         * ------------------------------------------------------------------------------
         * remove a sub item from the main transaction record
         * ------------------------------------------------------------------------------
         */
        delTransactionItem(){
            var self = this;

            var data = {id : self.transaction_item.id };
            data = JSON.stringify(data);

            //reset transaction record
            self.resetVariables();
    
            var result = $.post("/bookkeeping/record/item/del", data);
    
            result.done(function (data) {
                if (data.length > 0) {
                    
                    data = JSON.parse(data);   
                    
                    if (data == true) {                       

                        //hide the modal
                        $('#deleteModalItem').modal('hide');

                        //get updated list of transactions
                        self.transactionsGetAll();

                        //Display a success toast, with a title
                        toastr.success("You have successfully have removed an item from transaction record");                                              
                    }
                    else if(data == false){
                        // Display an error toast, with a title
                        toastr.error("Ops! There appears to be an error and selected item coudln't t be removed from the transaction record");
                    }  
                    
                    //reset transaction record and action
                    self.resetVariables();
                }                
            });
    
            result.always(function () {                     
            });
        },
        /**
         * -------------------------------------------------------------------------------------
         * edit main transaction record
         * -------------------------------------------------------------------------------------
         */
         transactionEdit(){
            var self = this;

            var data = self.transaction_record;
            data = JSON.stringify(data);

            var result = $.post("/bookkeeping/records/edit", data);
    
            result.done(function (data) {
                if (data.length > 0) {
                    
                    data = JSON.parse(data);   
                    
                    if (data == true) {   
                        
                        //close new transaction input form
                        //self.showForm(false);

                        //reset transaction record
                        self.resetVariables();

                        //get updated list of transactions
                        self.transactionsGetAll();

                        //Display a success toast, with a title
                        toastr.success("You have successfully have edited a main transaction record");                                              
                    }
                    else if(data == false){
                        // Display an error toast, with a title
                        toastr.error("Ops! There appears to be an error and selected main transaction coudln't be changed");
                    }
                    
                }                
            });
    
            result.always(function () { });
        },
        /**
         * -----------------------------------------------------------------------------------
         * when selected category in drop down has changed
         * -----------------------------------------------------------------------------------
         */
        categoryChanged() {
            var self = this;

            for(var i = 0; i < self.transaction_category.length; i++)
                if(self.transaction_category[i].category_name == self.category_selected)
                {
                    //push empty element to the first place of array
                    self.transaction_sub_category = [];
                    self.transaction_sub_category.push({
                        id : 0,
                        category_name : ''
                    });

                    //push the rest of sub categories               
                    if(self.category_selected.length > 0)
                        for(var y=0; y < self.transaction_category[i].sub_category.length; y++)
                            self.transaction_sub_category.push(self.transaction_category[i].sub_category[y]);                   

                    //select first value from sub categories (empty value)
                    self.sub_category_selected = '';

                    break;                    
                }   
                
            if(self.category_selected === '')
                self.transaction_sub_category_disabled = true;
            else self.transaction_sub_category_disabled = false;

            //initiate records pulling in accordance to the changed parameters
            self.transactionsGetAll();
        },
        /**
         *----------------------------------------------------------------------------
         * on transaction item category being changed, select proper sub categories
         * ----------------------------------------------------------------------------
         */
         categoryItemChanged(){
            var self = this;             

            for(var i = 0; i < self.transaction_category.length; i++)
                if(self.transaction_category[i].category_name == self.transaction_item.item_category){
                    self.transaction_sub_category = self.transaction_category[i].sub_category;                   
                    break;                    
                }   
         },
                /**
         * ------------------------------------------------------------------------------
         * remove main transaction items and all sub items
         * ------------------------------------------------------------------------------
         */
        delTransactionMain(){
            var self = this;

            var data = self.transaction_record;
            data = JSON.stringify(data);

            //reset transaction record
            //self.resetVariables();
    
            var result = $.post("/bookkeeping/records/del", data);
    
            result.done(function (data) {
                if (data.length > 0) {
                    
                    data = JSON.parse(data);   
                    
                    if (data == true) {                       

                        //hide the modal
                        $('#deleteModalRecord').modal('hide');

                        //remove transaction image receipt
                        self.transactionImageRemove();

                        //get updated list of transactions
                        self.transactionsGetAll();

                        //Display a success toast, with a title
                        toastr.success("You have successfully have removed main transaction item");                                              
                    }
                    else if(data == false){
                        // Display an error toast, with a title
                        toastr.error("Ops! There appears to be an error and selected transaction item coudln't t be removed");
                    }                    
                } 
                
                //reset transaction record and action
                self.resetVariables();
            });
    
            result.always(function () {
                var self = this;

                //reset transaction record and action
               //self.resetVariables();
            });
        },
        /**
         * -------------------------------------------------------------------------------
         * show delete modal for transaction record
         * -------------------------------------------------------------------------------
         */
        delTransactionShow (index){
            var self = this;

            self.transaction_record = Object.assign({}, self.transactions[index] );         

             //show the modal
             $('#deleteModalRecord').modal('show');
        },
         /**
         * -------------------------------------------------------------------------------
         * Hide delete modal for transaction
         * -------------------------------------------------------------------------------
         */
        delOneHide (){
            var self = this;

            //reset transaction object and action
            self.resetVariables();

             //show the modal
             $('#deleteModalRecord').modal('toggle');
        },                  
        /**
         * -------------------------------------------------------------------------------
         * show delete modal for transaction record Item
         * -------------------------------------------------------------------------------      
         */
        delTransactionItemShow (id, item_name){
            var self = this;

            self.transaction_item.id = id;
            self.transaction_item.item_name = item_name;         

             //show the modal
             $('#deleteModalItem').modal('show');
        },
         /**
         * -------------------------------------------------------------------------------
         * Hide delete modal for transaction Item
         * -------------------------------------------------------------------------------
         */
        delTransactionItemHide (){
            var self = this;

            //reset transaction object and action
            self.resetVariables();

             //show the modal
             $('#deleteModalItem').modal('toggle');
        }, 
        /**
         * -------------------------------------------------------------------------------
         * displays side bar with selected panel based on action chosen
         * -------------------------------------------------------------------------------
         */   
        setAction (action, index){
            var self = this;          

            //reset transaction record
            self.resetVariables();

            //show new transaction for action                                  
            if(action == 'new') self.action.new = true;
            else if(action == 'edit'){

                self.action.edit = true;
                self.transaction_record = Object.assign({}, self.transactions[index] );                                 
            } 
            else if(action == 'new_item'){

                self.transaction_item.transaction_id = self.transactions[index].id;              
                self.action.new_item = true;
            }
            else if(action == 'image') {
                self.action.image = true;                                    

                //assign transaction id                
                self.transaction_record = Object.assign({}, self.transactions[index] );        
            }
            else if(action == 'image_view'){
                self.action.image_view = true;
                self.transaction_record = Object.assign({}, self.transactions[index] );        
            }
        },
        /**
         * -------------------------------------------------------------------------------
         * assigns start and end date to the date input fields
         * -------------------------------------------------------------------------------
         */
        assignDates(){
            var self = this;

            var today = new Date();
            // var dd = String(today.getDate()).padStart(2, '0');
            // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
    
            //format is yyyy/mm/dd
            self.start_date = yyyy + '-01-01';
            self.end_date = yyyy + '-12-01';
    
            //booklogitem
            //self.booklog_item.travel_date = yyyy + '-' + mm + '-' + dd;
        }, 
        /**
         * ------------------------------------------------------
         * get vendor address
         * ------------------------------------------------------
         */     
         getVendorAddress(){
             var self = this;

             //clear any existing address from old selections
             self.transaction_record.vendor_address = '';

            //find and assign a vendor address         
            for(var i = 0; i < self.vendors.length; i++)
            if(self.vendors[i].vendor_name == self.transaction_record.vendor_name){
                self.transaction_record.vendor_address = self.vendors[i].vendor_address;
                break;
            }
         },
         /**
          * --------------------------------------------------
          * displays chart with total income and expences
          * at glance.
          * --------------------------------------------------
          */
         barChartTotalsJS (){
            var self = this;

            //remove old canvas and create new
            $('#barChartTotalAmount').remove();
            $('#chartWrapper').append('<canvas id="barChartTotalAmount" class="shadow-sm border bg-white my-1"></canvas>');

            const labels = ['Expences', 'Income'];
            const data = {
              labels: labels,
              datasets: [{
                label: 'Expences and Income',
                data: [self.transaction_totals.total_expences, self.transaction_totals.total_income],
                backgroundColor: [                
                  '#dc3545',
                  'rgba(7, 156, 44)'
                ],
                borderColor: [
                    '#dc3545',
                    'rgba(7, 156, 44)'
                ],
                borderWidth: 1
              }]
            };

            const config = {
                type: 'bar',
                data: data,
                options: {
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                },
            };

            var ctx = document.getElementById('barChartTotalAmount');
            var myChart = new Chart(ctx, config);
         },
          /**
          * --------------------------------------------------
          * displays chart with total income and expences
          * at glance.
          * --------------------------------------------------
          */
           barChartPercentageJS (){
            var self = this;

            //remove old canvas and create new
            $('#barChartTotalPercentage').remove();
            $('#chartWrapper').append('<canvas id="barChartTotalPercentage" class="shadow-sm bg-white border my-3"></canvas>');            

            let cattle_expences = self.transaction_totals.total_cattle_expences * 100 / self.transaction_totals.total_expences;
            let feed_expences = self.transaction_totals.total_feed_expences * 100 / self.transaction_totals.total_expences;
            let fuel_expences = self.transaction_totals.total_gasoline_expences * 100 / self.transaction_totals.total_expences;
            let vet_expences = self.transaction_totals.total_veterinary_expences * 100 / self.transaction_totals.total_expences;

            const data = {
                labels: [
                  'Cattle %',
                  'Feed %',
                  'Fuel %',
                  'Veterinary %'
                ],
                datasets: [{
                  label: 'Total percentage',
                  data: [cattle_expences, feed_expences, fuel_expences, vet_expences],
                  backgroundColor: [
                    '#dc3545',
                    'rgba(7, 156, 44)',
                    '#FFCC00',
                    '#33A1DE' 
                  ],
                  hoverOffset: 4
                }]
            };

            const config = {
                type: 'pie',
                data: data,
              };

            var ctx = document.getElementById('barChartTotalPercentage');
            var myChart = new Chart(ctx, config);
         },
        /**
         * ------------------------------------------------------
         * reset for transaction and transaction item
         * ------------------------------------------------------
         */
        resetVariables(){
            var self = this;                     

            //set today date
            var today = new Date();
            var dd = String(today.getDate()).padStart(2,'0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            //self.transaction_record.trans_date = today.getFullYear() + '-' + mm + '-' + dd;

            //reset transaction record
            self.transaction_record = {
                id : 0,
                vendor_name : '',
                vendor_address: '',
                trans_desc : '',
                trans_image : '',
                trans_currency: 'C$',
                trans_date : today.getFullYear() + '-' + mm + '-' + dd
            };

            self.action = {
                new : false,
                edit: false,
                new_item : false,
                image : false,
                image_view : false,
                chart : false
            };

            //transaction item
            self.transaction_item = {
                id : 0,
                transaction_id : 0,
                item_name : '',
                item_desc : '',
                item_category : '',
                item_subcategory : '',
                amount : 0,
                hst_tax : 0,
                gst_tax : 0,
                pst_tax : 0,
                is_expence: false             
            };          
        }
    }
};

const app = Vue.createApp(transactions)
                .mount('#transactions');
