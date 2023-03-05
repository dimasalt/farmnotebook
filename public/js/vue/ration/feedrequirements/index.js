const Ration = {
    data() {
        return {   
            results: [],
            result_totals : {
                grain_daily : 0,
                hay_daily : 0,
                grain_twice_day : 0,
                hay_twice_day : 0,
                scoops_daily : 0,
                scoops_twice_day : 0,
                grain_finish : 0,
                hay_finish : 0,
                grain_finish_price : 0,
                hay_finish_price : 0,
                average_weight: 0
            },
            feeds: [],
            default_feeds: [],
            selected_feed : '',
            nutrition_req: [],
            requirements : {
                adg : 1,              
                scoop : 2.5,
                start_weight : 200,
                end_weight : 600,
                heads : 1
            },
            adg : [],
            adg_selected : '3.0',
            is_feed_proper : false            
        }
    },
    mounted() {
        var self = this;       
        
        //get intial information from database
        self.getFeeds();
        self.getRequirementsADG();
    },
    methods: {
        getFeeds (){
            var self = this;
                         
            let data = {};

            //reset variables
            self.feeds = [];
            self.default_feeds = [];
           
            //prepare data for php          
            data = JSON.stringify(data);

            var result = $.post("/ration/ration_calculator/getfeeds", data);

            result.done(function (data) {                     
               data = JSON.parse(data);

                //if successfully added 
               if(data.length > 0){  

                    //load all feeds into datalist
                    self.feeds = data;   
                    
                    //counters for proper feed if presented
                    let grain_count = 0, protein_count = 0, hay_count = 0;
                    
                    //find default feeds and check if there enough protein, grain and hay in default feeds
                    for(var i=0; i < self.feeds.length; i++){
                        if(self.feeds[i].is_default == 1){

                            //display default feeds
                            self.default_feeds.push(self.feeds[i]);

                            //check feed types
                            if (self.feeds[i].feed_type == "Grain")
                                grain_count++;
                            else if (self.feeds[i].feed_type == "Protein")
                                protein_count++;
                            else 
                                hay_count++;
                        }
                    }

                    //check if feed can be calculated
                    if(grain_count > 0 && protein_count > 0 && hay_count > 0)
                        self.is_feed_proper = true;
                    else self.is_feed_proper = false;
               }            
            });

            result.always(function () {
            });
        },  
        /**
         * ----------------------------------------------------
         * gets feed requirements for cattle
         * -----------------------------------------------------     
         */
        getFeedRequirements(){
            var self = this;

            //reset old feed requirements
            self.nutrition_req = [];

            //prepare data for php        
            let data = {          
                adg : self.adg_selected,
                start_weight : self.requirements.start_weight,
                end_weight : self.requirements.end_weight,    
                csrf : $('#csrf').val()
            };  
            data = JSON.stringify(data);

            var result = $.post("/ration/ration_calculator/getFeedRequirements", data);
 
            result.done(function (data) {                     
                data = JSON.parse(data);
 
                 //if successfully added 
                if(data.length > 0){  
 
                    self.nutrition_req = data;  
                    
                    //display result
                    self.calculateFeedRequirement();
                }            
            });
 
             result.always(function () {
            });
        },
        getRequirementsADG() {
            var self = this;

            //reset existing adg
            self.adg = [];

            //prepare data for php        
            let data = {};  
            data = JSON.stringify(data);

            var result = $.post("/ration/ration_calculator/FeedRequirementsAdg", data);
 
            result.done(function (data) {                     
                data = JSON.parse(data);
 
                 //if successfully added 
                if(data.length > 0){  
 
                    self.adg = data;  
                    
                    //display result                   
                }            
            });
 
             result.always(function () {
            });
        },
        /**
         *-----------------------------------------------
         * sets feed as default. 
         * 1 means feed is default. 0 means feed is not default
         * --------------------------------------------------
         */
        setFeedAsDefault (is_default = 0){
            var self = this;

            let id = 0;
            //find selected feed
            for(let i = 0; i < self.feeds.length; i++){
                if(self.feeds[i].feed_name == self.selected_feed)
                {
                    id = self.feeds[i].id;     
                    break;               
                }
            }

            //prepare data object
            let data = {
                id : id,
                is_default : is_default,
                csrf : $('#csrf').val()
            };

            //prepare data for php          
            data = JSON.stringify(data);

            var result = $.post("/ration/ration_calculator/setDefaultFeed", data);

            result.done(function (data) {                     
                data = JSON.parse(data);
 
                 //if successfully added 
                if(data == true){  

                    self.selected_feed = '';
                    self.getFeeds();
                }            
            });
 
            result.always(function () {
            });
        },
        /**
         * gets all livestock based on search and default values
         */
        calculateFeedRequirement () {
            var self = this;

            //reset results
            self.results = [];

            //define temporary variables
            let grain_temp = {}, protein_temp = {}, hay_temp = {}, result_temp = {};

            //assign values to a temp variables
            for (var i = 0; i < self.feeds.length; i++) {
                if (self.feeds[i].feed_type == "Grain")
                    grain_temp = self.feeds[i];
                else if (self.feeds[i].feed_type == "Protein")
                    protein_temp = self.feeds[i];
                else if (self.feeds[i].feed_type == "Hay")
                    hay_temp = self.feeds[i];
            }

            //calculate requirements
            for (var i = 0; i < self.nutrition_req.length; i++) {
            
                let grain_square, hay_square, grain_tot_lb, hay_tot_lb;

                //calculate TDN %
                grain_square = grain_temp.feed_tdn - self.nutrition_req[i].tdn;
                if (grain_square < 0)
                    grain_square = grain_square * (-1);

                hay_square = hay_temp.feed_tdn - self.nutrition_req[i].tdn;
                if (hay_square < 0)
                    hay_square = hay_square * (-1);
                
                let grain_ratio = hay_square / (hay_square + grain_square);
                let hay_ratio = grain_square / (hay_square + grain_square);

                grain_tot_lb = grain_ratio * self.nutrition_req[i].dm_per_day;
                hay_tot_lb = hay_ratio * self.nutrition_req[i].dm_per_day;

                /* round decimals */
                grain_tot_lb = Math.round(grain_tot_lb * 10) / 10;
                hay_tot_lb = Math.round(hay_tot_lb * 10) / 10;     

                //assing values to the temporary result object
                result_temp.weight = self.nutrition_req[i].weight;
                result_temp.grain_tot_lb = grain_tot_lb;
                result_temp.hay_tot_lb = hay_tot_lb; 
              

                //calculate CP %
                let  grain_CP, hay_CP;
                grain_CP = grain_ratio * grain_temp.feed_cp;       
                hay_CP = hay_ratio * hay_temp.feed_cp;

                let grain_req_CP = (self.nutrition_req[i].cp - hay_CP);
                let grain_needed_CP = (grain_req_CP / grain_ratio);    
            
                let grain_square_CP, protein_square_CP;
                grain_square_CP = grain_temp.feed_cp - grain_needed_CP;
                protein_square_CP = protein_temp.feed_cp - grain_needed_CP;
                
                if(grain_square_CP < 0) 
                    grain_square_CP = grain_square_CP * (-1);

                if(protein_square_CP < 0)
                    protein_square_CP = protein_square_CP * (-1);       


                let grain_ratio_CP, protein_ratio_CP;
                grain_ratio_CP = protein_square_CP / (grain_square_CP + protein_square_CP);
                protein_ratio_CP = grain_square_CP /  (grain_square_CP + protein_square_CP);       
                
                let grain_lb = grain_ratio_CP * grain_tot_lb;
                let protein_lb = protein_ratio_CP * grain_tot_lb;   
                
                /* round decimals */
                grain_lb = Math.round(grain_lb * 10) / 10;
                protein_lb = Math.round(protein_lb * 10) / 10;     

                result_temp.grain_lb = grain_lb;
                result_temp.protein_lb = protein_lb;

                //add total dry matter needed and animal type
                result_temp.dm = self.nutrition_req[i].dm_per_day;
                result_temp.animal_type = self.nutrition_req[i].animal_type;
                
                //add ADG
                result_temp.adg = self.nutrition_req[i].adg;

                //asing result to the result array object
                self.results.push(Object.assign({}, result_temp));                 
            }

            //calculate weight
            self.calculateTotals();
        },
        calculateTotals(){
            var self = this; 

            //reset totals
            self.resetVariables();

            //find average weight
            self.result_totals.average_weight = (parseInt(self.requirements.start_weight) + parseInt(self.requirements.end_weight)) / 2;

            let average_weight_temp = Math.floor(self.result_totals.average_weight / 100) * 100;
            //or 
            //let average_weight_temp = Math.round(self.result_totals.average_weight / 100) * 100;
            
            //find adg and everything else
            let current_requirement = {};
            for(let i = 0; i < self.results.length; i++){
                if(self.results[i].weight == average_weight_temp)
                    current_requirement = self.results[i];                
            }

            //calculate daily grain
            self.result_totals.grain_daily = (current_requirement.grain_tot_lb * self.requirements.heads).toFixed(1);

            //daily hay
            self.result_totals.hay_daily = current_requirement.hay_tot_lb * self.requirements.heads;

            //grain twice a day
            self.result_totals.grain_twice_day = (self.result_totals.grain_daily / 2).toFixed(1);

            //hay twice a day
            self.result_totals.hay_twice_day = self.result_totals.hay_daily / 2;

            //grain scoops a day
            self.result_totals.scoops_daily = parseFloat(self.result_totals.grain_daily / self.requirements.scoop).toFixed(1);

            //grain scoops twice a day
            self.result_totals.scoops_twice_day = parseFloat(self.result_totals.grain_twice_day / self.requirements.scoop).toFixed(1);

            //calculate grain and hay finish and how much it's going to cost.
            for(let i = 0; i < self.results.length; i++){
                
                //grain total lbs
                self.result_totals.grain_finish += Number(self.results[i].grain_tot_lb * 30);

                //hay total lbs
                self.result_totals.hay_finish += Number(self.results[i].hay_tot_lb * 30);
            }

            //set per heads
            self.result_totals.grain_finish = self.result_totals.grain_finish * self.requirements.heads

            self.result_totals.hay_finish = self.result_totals.hay_finish * self.requirements.heads

            //cost of grain for total finish weight
            //grain price per lb
            let grain_price_lb = 0, hay_price_lb = 0;
            for(let i = 0; i < self.feeds.length; i++){
                if (self.feeds[i].feed_type == "Grain")
                    grain_price_lb = Number(self.feeds[i].feed_price) / Number(self.feeds[i].feed_price_lb);
                else if (self.feeds[i].feed_type == "Hay")
                    hay_price_lb = Number(self.feeds[i].feed_price) / Number(self.feeds[i].feed_price_lb);
            }

            //price for finish grain and hay     
            //formated to USD currency
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'             
            });

            self.result_totals.grain_finish_price = (self.result_totals.grain_finish * grain_price_lb).toFixed(1);
            self.result_totals.grain_finish_price = formatter.format(self.result_totals.grain_finish_price);
            
            self.result_totals.hay_finish_price = self.result_totals.hay_finish * hay_price_lb;
            self.result_totals.hay_finish_price = formatter.format(self.result_totals.hay_finish_price);
        },
        /**
         * ---------------------------------
         * reset variables 
         * ---------------------------------
         */
        resetVariables() {
            var self = this;

            self.result_totals = {
                grain_daily : 0,
                hay_daily : 0,
                grain_twice_day : 0,
                hay_twice_day : 0,
                scoops_daily : 0,
                scoops_twice_day : 0,
                grain_finish : 0,
                hay_finish : 0,
                grain_finish_price : 0,
                hay_finish_price : 0,
                average_weight: 0
            };
        }
    }
};

const app = Vue.createApp(Ration)
                .mount('#ration');
