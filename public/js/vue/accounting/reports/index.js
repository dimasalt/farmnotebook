const reports = {
    data() {
        return {
            monthlyReports: [],
            start_date : new Date().getFullYear()  + '-01-01', //format yyyy + '-' + mm + '-' + dd;
            end_date:  new Date().getFullYear()  + '-12-31', //format yyyy + '-' + mm + '-' + dd;
            category_selected : '',
            sub_category_selected : '',
            transaction_category : [],
            transaction_sub_category : [],
            transaction_sub_category_disabled : true,
            search_term : ''
        }
    },   
    created () { 
        var self = this;

        //get categories
        self.getCategories();


        self.reportsGetAll ();

        //reset transaction record and item 
        //self.resetVariables();        
    },
    methods: {    
        /**
         * if seach term changed get new records list
         */
        goSearch() {
            var self = this;
           
            self.reportsGetAll();
        },
        reportsGetAll () {
            //gets all project items
            var self = this;             
    
            //prepare data object 
            //includes search term, date and selected categories and sub categories
            var data = {
                // search_term : self.search_term, 
                // category_selected : self.category_selected,
                // sub_category_selected: self.sub_category_selected,
                start_date: self.start_date, 
                end_date :  self.end_date 
            };          
    
            var result = $.post("/accounting/reports/api/get/monthly", data);
    
            result.done(function (data) {
                if (data.length > 0) {                                     
                    self.monthlyReports = data;              
                }
                else {
                    // //reset transaction records
                    // self.transactions = [];

                    //  //reset totals
                    // self.transaction_totals = {
                    //     total_expences : 0,
                    //     total_income : 0,
                    //     total_feed_expences : 0,
                    //     total_cattle_expences : 0,
                    //     total_veterinary_expences : 0,
                    //     total_gasoline_expences : 0,
                    //     total_equipment : 0,
                    //     total_profit : 0
                    // };
                }
            });
    
            result.always(function () { });
        },
           /**
         * -------------------------------------------------------------
         * get transaction categories
         * -------------------------------------------------------------
         */
        getCategories (){
            var self = this;

            var data = {};
            var result = $.post("/accounting/categories/api/get/all", data);
    
            result.done(function (data) {
                if (data.length > 0) {            

                    self.transaction_category.push({id: '0', category_name : ''});
                    for (var i = 0; i < data.length; i++)
                        self.transaction_category.push(data [i]);
                    
                        
                    self.transaction_category_selected = self.transaction_category[0].id;
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
         * ------------------------------------------------------
         * reset for transaction and transaction item
         * ------------------------------------------------------
         */
        resetVariables(){
            var self = this;                     

          
        }
    }
};

const app = Vue.createApp(reports)
                .mount('#reports');
