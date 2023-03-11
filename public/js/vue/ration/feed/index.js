const Feed = {
    data() {
        return {   
            feeds: [],
            feed_item : {},
            action : {
                new : false,
                edit : false
            }           
        }
    },
    mounted() {
        var self = this;       
        
        //reset variables
        self.resetVariables();

        //get intial information from database
        self.getFeeds();
       
    },
    methods: {
        getFeeds (){
            var self = this;
                         
            let data = {};

            //reset variables
            self.feeds = [];                            

            var result = $.post("/ration/feeds/api/get/all", data);

            result.done(function (data) {                     

                //if successfully added 
               if(data.length > 0){  

                    //load all feeds into datalist
                    self.feeds = data;   
                    
                    
               }            
            });

            result.always(function () {
            });
        },  
         /**
         * ----------------------------------------------
         * Creates new feed item 
         * ----------------------------------------------
         */             
        feedCreate(){
            var self = this;         

            if(self.feed_item.feed_name.length == 0){
                toastr.error("Ops! New feed item has no name");

                //exit procedure
                return;
            }
                        
            let data = {               
                feed_item : self.feed_item
            };                       
    
            var result = $.post("/ration/feeds/api/add", data);
    
            result.done(function (data) {                                   
    
                if(data == true){
                    //Display a success toast, with a title
                    toastr.success("You have successfully created new feed item");  
                    
                    // //reload feeds
                    self.getFeeds();
                    //self.feeds.push(Object.assign({}, self.feed_item));
                }
                else if(data == false){
                    // Display an error toast, with a title
                    toastr.error("Ops! There appears to be an error and new feed item could not be added");
                }

                //reset feed item variable values
                self.resetVariables();

                //hide form
                self.action = { 
                    new : false,
                    edit : false
                };
            });

                
            result.always(function () {
            });
        },   
        /**
         * ----------------------------------------------
         * fill out edit input form
         * ----------------------------------------------
         */             
        updateForms(index){            
            var self = this;

            self.action = { 
                new : false,
                edit : true
            };

             //asing result to the result array object
             self.feed_item = Object.assign({}, self.feeds[index]);              
        }, 
         /**
         * ----------------------------------------------
         * Updates values of existing feed
         * ----------------------------------------------
         */             
        feedUpdate(){
            var self = this;         
                        
            let data = {                
                feed_item : self.feed_item
            };                         
    
            var result = $.post("/ration/feeds/api/update", data);
    
            result.done(function (data) {                                    
                if(data == true){
                    //Display a success toast, with a title
                    toastr.success("You have successfully updates the feed item");  
                    
                    //assing updated feed item
                    for(var i = 0; i < self.feeds.length; i++)
                        if(self.feeds[i].id == self.feed_item.id)
                            self.feeds[i] = Object.assign({}, self.feed_item );
                }
                else if(data == false){
                    // Display an error toast, with a title
                    toastr.error("Ops! There appears to be an error and new feed item values could not be updated");
                }

                //reset feed item variable values
                self.resetVariables();

                self.action = { 
                    new : false,
                    edit : false
                };
            });

                
            result.always(function () {
            });
        },        
         /**
         * ----------------------------------------------
         * clear out information from edit input form
         * ----------------------------------------------
         */             
        clearForms(){
            var self = this;

             //clear information
             self.resetVariables();

            //reset form
            self.action = { 
                new : false,
                edit : false
            };
        },          
        /**
         * ----------------------------------------------
         * show deletion modal 
         * ----------------------------------------------
         */
        showDeleteModal(id, name){

            var self = this;

            //reset variables
            self.resetVariables();

            //set new values
            self.feed_item.id = id;
            self.feed_item.feed_name = name;

            $('#deleteModalRecord').modal('show');
        },
        hideDeleteModal(){
            var self = this;

            //reset variables and hide the delete modal
            self.resetVariables();
            $('#deleteModalRecord').modal('hide');
        },
        /**
         * ------------------------------------------------
         * remove feed from database and list
         * ------------------------------------------------
         */
         deleteFeed(){             
             var self = this;

             //hide modal
             $('#deleteModalRecord').modal('hide');

             var self = this;
                         
             let data = {
                id : self.feed_item.id
             };                                  
 
            var result = $.post("/ration/feeds/api/delete", data);
 
            result.done(function (data) {                                    
 
                if(data == true){
                    //Display a success toast, with a title
                    toastr.success("You have successfully removed feed item");  

                    //remove item from the array
                    let index = -1;
                    for(var i=0; i < self.feeds.length; i++)
                        if(self.feeds[i].id == self.feed_item.id) {
                            index = i;
                            break;
                        }
                  
                    if(index > -1) 
                        self.feeds.splice(index, 1);
                }
                else if(data == false){
                    // Display an error toast, with a title
                    toastr.error("Ops! There appears to be an error and selected feed item cannot be removed");
                }

                //reset feed item variable values
                self.resetVariables();

                //reset form
                self.action = { 
                    new : false,
                    edit : false
                };
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
            
            self.feed_item = {
                id : 0,
                feed_name : '',
                feed_desc: '',
                feed_cp : 0,
                feed_tdn : 0,
                feed_type : '',
                feed_price: 0,
                feed_price_lb : 0, 
                feed_usage : 100
            };
        }
    }
};

const app = Vue.createApp(Feed)
                .mount('#feed');
