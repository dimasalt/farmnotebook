const livestock = {
    data() {
        return {     
            start_date : '',
            end_date: '',
            livestock : [],
            livestock_item : {},
            livestock_types : [],       
            livestock_subtypes : [],
            livestock_groups : [],
            pagination : {
                current_page: 1,
                records: 25,
                total_pages: 0,
                pages_array : []
            },
            category_selected : '',
            sub_category_selected : '',
            sub_category_disabled : true,

            group_selected : '',

            action : {
                new : false,
                edit : false
            }
        }    
    },
    mounted() {
        var self = this;       
        
        //clear variables
        self.resetVariables();

        //get livestock inventory
        self.getLiveStockInventory();

        //get livestok types
        self.getLiveStockTypes();

        //get livestock groups
        self.livestockGetGroups();
    },
    methods: {
        /**
         * gets all livestock based on search and default values
         */
        getLiveStockInventory () {
            var self = this;

            //prepare data
            var data = {
                current_page : self.pagination.current_page,
                records : self.pagination.records
            };
            data = JSON.stringify(data); // $.param({ 'id': ticket_id });

            var livestockInventory = $.post( "/inventory/livestock/get/all", data);

            livestockInventory.done(function( data ) {

                data = JSON.parse(data);     
                self.livestock = data;

                if(self.livestock.length > 1)
                    self.pagination.total_pages = self.livestock[0].total_pages;                    
                

                //create array for pagination pages
                self.pagination.pages_array = [];
                for(var i = 0; i < self.pagination.total_pages; i++){
                    self.pagination.pages_array.push(i + 1);
                }
            });

            livestockInventory.always(function () {
                // Reenable the inputs
                // $('input').prop( "disabled", false );
            });          
        },

        /**
         * -------------------------------------------------------
         * get livestock types present on the farm
         * ------------------------------------------------------
         */
        getLiveStockTypes () {
            var self = this;

            var data = {};
            data = JSON.stringify(data);

            var liveStockInventoryTypes = $.post("/inventory/types/get/all" , data);

            liveStockInventoryTypes.done(function (data) {
                            
                if(data.length > 0){

                    data = JSON.parse(data);     
                    self.livestock_types = data;
                    self.livestock_item.livestock_types = data;

                    self.category_selected = '';
                }
            });

            liveStockInventoryTypes.always(function () {
            });
        },
        
        /**
         * ---------------------------------------------------------------
         * drop down category selection changed
         * ---------------------------------------------------------------
         */
         categoryChanged(){
            var self = this;

            if(self.category_selected.length > 0)
            {
                for(var i = 0; i < self.livestock_types.length; i++)
                {
                    if(self.livestock_types[i].category_name == self.category_selected){
                        self.livestock_subtypes = self.livestock_types[i].sub_items;
                        break;
                    }
                }
                self.sub_category_disabled = false;
            }
            else {
                self.sub_category_selected = '';
                self.sub_category_disabled = true;
            }
         },

        /**
         * -------------------------------------------------------------------
         * livestock categories for the livestock existing or new item
         * -------------------------------------------------------------------
        */     
        livestockItemCategoryChanged(){
            var self = this;

            if(self.livestock_item.livestock_types.length > 0)
            {
                for(var i = 0; i < self.livestock_item.livestock_types.length; i++)
                {
                    if(self.livestock_item.livestock_types[i].category_name == self.livestock_item.livestock_type){
                        self.livestock_item.livestock_subtypes = self.livestock_types[i].sub_items;
                        break;
                    }
                }
                self.sub_category_disabled = false;
            }
            else self.sub_category_disabled = true;
        },
        /**
         * -------------------------------------------------------------------------
         * gets livestock groups
         * -------------------------------------------------------------------------
         */
        livestockGetGroups(){
            var self = this;

            var data = {};
            data = JSON.stringify(data);

            var liveStockInventoryGroups = $.post("/inventory/groups/get/all" , data);

            liveStockInventoryGroups.done(function (data) {
                            
                if(data.length > 0){

                    data = JSON.parse(data);     
                    self.livestock_groups = data;                  

                    self.group_selected = '';
                }
            });

            liveStockInventoryGroups.always(function () {
            });
        },
        /**
         * -------------------------------------------------------------------------
         * on tags texarea input change
         * function checks if there is more than one tag inserted, if yes then it will hide some events
         * --------------------------------------------------------------------------
         */
        tagChange (){
            var self = this;

            //remove white space and split the tags
            self.livestock_item.tag = self.livestock_item.tag.trim();
            const tags = self.livestock_item.tag.split(",").filter(Boolean);
            
            //check if show events input
            if(tags.length < 2) self.livestock_item.is_events_visible = true;
            else self.livestock_item.is_events_visible = false;
        },
        /**
         * ---------------------------------------------------------------
         * reset all variables
         * ---------------------------------------------------------------
        */   
        resetVariables(){
            var self = this;

            //current date
            const today = new Date();


            self.start_date = new Date().getFullYear()  + '-01-01'; //format yyyy + '-' + mm + '-' + dd;
            self.end_date =  new Date().getFullYear()  + '-12-31'; //format yyyy + '-' + mm + '-' + dd; 

            self.category_selected = '';
            self.sub_category_selected = '';
            self.sub_category_disabled = true;

            //reset livestock item
            self.livestock_item = {
                id : 0,
                tag : '',                
                livestock_type : '',
                livestock_subtype : '',
                weight : 0,
                price : 0,              
                is_active : 1,
                livestock_types : [],
                livestock_subtypes : [],
                current_date : today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
                is_events_visible : true
            };

            //action item
            self.action = {
                new : true,
                edit : false
            };
        }     
    }
};

const app = Vue.createApp(livestock)
                .mount('#livestock');

