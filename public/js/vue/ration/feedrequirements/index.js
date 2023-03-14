const FeedRequirements = {
    data() {
        return {   
            feedings: [],
         
            search_item : {
                adg_selected : '0',                            
                start_weight_selected : '200',
                end_weight_selected : '4000',       
                adgs : [],
                start_weights : [],
                end_weights : []
            },                  
        }
    },
    mounted() {
        var self = this;       
        
        //reset all variables
        self.resetVariables();

        //get intial information from database
        self.getFeedRequirements();      
        
        //get ADGS (average daily gains)
        self.getADGs();

        //get weights
        self.getWeightss();
    },
    methods: {     
        /**
         * ----------------------------------------------------
         * gets feed requirements for cattle
         * -----------------------------------------------------     
         */
        getFeedRequirements(){
            var self = this;

            //reset old feed requirements
            self.feedings = [];

            //prepare data for    
            let data = {          
                adg: self.search_item.adg_selected,
                start_weight : self.search_item.start_weight_selected,
                end_weight : self.search_item.end_weight_selected              
            };            

            var result = $.post("/ration/feeds/required/api/get/all", data);
 
            result.done(function (data) {                                 
 
                 //if successfully added 
                if(data.length > 0){  
                    self.feedings = data;                                      
                }            
            });
 
            result.always(function () {
            });
        },
        /**
         * -------------------------------------
         * Get all the ADGS (Average Daily Gain)
         * ------------------------------------
         */
        getADGs(){
            var self = this;              

               //prepare data for    
               let data = {};            
   
               var result = $.post("/ration/feeds/required/api/get/adgs", data);
    
               result.done(function (data) {                                 
    
                    //if successfully added 
                   if(data.length > 0){  
    
                       self.search_item.adgs = data;                                      
                   }            
               });
    
               result.always(function () {
               });
        },
         /**
         * -------------------------------------
         * Get all available weights
         * ------------------------------------
         */
         getWeightss(){
            var self = this;              

               //prepare data for    
               let data = {};            
   
               var result = $.post("/ration/feeds/required/api/get/weights", data);
    
               result.done(function (data) {                                 
    
                    //if successfully added 
                   if(data.length > 0){  
    
                       self.search_item.start_weights = data;     
                       self.search_item.end_weights = data;                           
                   }            
               });
    
               result.always(function () {
               });
        },
        /**
         * ---------------------------------
         * reset variables 
         * ---------------------------------
         */
        resetVariables() {
            var self = this;

            //reset feeding list
            self.feedings = [];

            //search items
            self.search_item = {
                adg_selected : 0,                            
                start_weight_selected : 100,
                end_weight_selected : 4000,       
                adgs : [],
                start_weights : [],
                end_weights : []
            }               
        }
    }
};

const app = Vue.createApp(FeedRequirements)
                .mount('#feedrequired');
