const inventoryTypes = {
    data() {             
        return {
            inventory_cats: [], 
            inventory_subcats: [],
            work_item : {
                id : 0,
                parent_id : 0,
                category_name : '',
                category_description : ''
            },       
            cat_work_form: false,
            selected_index : 0
        }
    },
    mounted() {
        var self = this;

        //get all the projects
        self.getTypes();
    },
    methods: {
        getTypes() {
            //gets all project items
            var self = this;           

            var data = {};           

            var result = $.post("/inventory/types/api/get/all", data);

            result.done(function (data) {
                if (data.length > 0) {

                    self.inventory_cats = data;                

                    //get sub categories for the very first item
                    self.selectCategory(self.selected_index);               
                }
            });

            result.always(function () { });
        },
        selectCategory(index){
            var self = this;

            self.inventory_subcats = [];                 
            self.inventory_subcats = self.inventory_cats[index].sub_items;         

            //adjust value of selected index
            self.selected_index = index;

            //change active element in the list
            for(var i = 0; i < self.inventory_cats.length; i++)
            {
                if(i == index) self.inventory_cats[i].is_active = true;
                else self.inventory_cats[i].is_active = false;
            }

              //close category form
              self.closeCatItemForm();         
        },
        newCategoryClick(){
            var self = this;

              //close category form
              self.closeCatItemForm();

            self.work_item.id = 0;
            self.work_item.parent_id = 0;
            self.work_item.category_name = '';
            self.work_item.category_description = '';

            self.cat_work_form = true;


        },
        newSubCategoryClick(){
            var self = this;

            //close category form
            self.closeCatItemForm();

            var parent_id = 0;

            //find a main parent category
            for(var i = 0; i < self.inventory_cats.length; i++)
                if(self.inventory_cats[i].is_active == true){
                    parent_id = self.inventory_cats[i].id;
                    break;
                }

            self.work_item.id = 0;
            self.work_item.parent_id = parent_id;
            self.work_item.category_name = '';
            self.work_item.category_description = '';

            self.cat_work_form = true;
        },
        editCategoryClick(index){ //edit existing category
            var self = this;        
            
            self.closeCatItemForm();

            //change category to active and pull it sub categories
            self.selectCategory(index);
              
            //deep copy (not by reference as default in javascript )
            //self.inventory_subcats = JSON.parse(JSON.stringify( self.inventory_cats[index].sub_category));      
            
            //assign values to working item //shallow copy them rather than referencing
            self.work_item = Object.assign({}, self.inventory_cats[index] );

            //show form
            self.cat_work_form = true;
        },
        editSubCategoryClick (edit_item) {
            var self = this;           

            self.closeCatItemForm();
            
            self.work_item.id = edit_item.id;
            self.work_item.parent_id = edit_item.parent_id;
            self.work_item.category_name = edit_item.category_name;
            self.work_item.category_description = edit_item.category_description;                

             //show form
             self.cat_work_form = true;
        },
        closeCatItemForm(){
            var self = this;

              //assing edit or new item\
              self.work_item.id = 0;
              self.work_item.parent_id  = 0;
              self.work_item.cat_name = '';
              self.work_item.cat_desc = '';        

            self.cat_work_form = false;
        },
        saveCategory (){
            var self = this;

            var data = {category_item : self.work_item};

            var result = $.post("/inventory/types/api/add", data);

            result.done(function (data) {               
                if(data.result === true){                   
                    //Display a success toast, with a title
                    toastr.success("New changes has been successfully added");                
               }
               else if(data.result == false) {                  
                    // Display an error toast, with a title
                    toastr.error("Ops! There has been problem adding new changes...");
               }

               //close and clear form
               self.closeCatItemForm();
               
               //reload categories and sub categories
               self.getTypes();
            });

            result.always(function () { });
        },
        deleteCategoryModal(category_item){
            var self = this;

             //hide modal
             $('#deleteModal').modal('hide');

            self.work_item = category_item;

             //hide modal
             $('#deleteModal').modal('show');

        },     
        deleteCategoryModalHide(){
            var self = this;

            $('#deleteModal').modal('hide');

        },
        deleteCategory(category_id){
            var self = this;

            var data = {category_id : category_id};

            var result = $.post("/inventory/types/api/delete", data);

            result.done(function (data) {
                if(data === true){                   
                    //Display a success toast, with a title
                    toastr.success("Category has been successfully removed");                
               }
               else if(data == false) {                  
                    // Display an error toast, with a title
                    toastr.error("Ops! There has been problem removing the category item...");
               }               
               
                //hide modal
                $('#deleteModal').modal('hide');

               //reload categories and sub categories
               self.getTypes();
            });

            result.always(function () { });
        }
    }
};

const app = Vue.createApp(inventoryTypes)
                .mount('#inventoryTypes');