const contacts = {
    data(){
        return {
            contacts : [],         
            contact_item : {},
            contact_type : [],
            contact_type_default : -1,
            contact_type_selected : -1,
            search_term: '',
            contact_delete : {},
            action : '',
            order_by : {},
            order_by_selected : '',
            //paging
            pager : {
                current_page: 1,
                limit : 25,
                total_records : 0
            }
        }
    },
    created() {
        var self = this;

        //checking vue js version
        //console.log(Vue.version);

        //set select for contacts or vendors
        self.contact_type = [
            {contact_type : 1, name : 'Vendor' },
            {contact_type : 2, name : 'Customer' },
            {contact_type : 3, name : 'Contacts' },
        ];

        self.order_by = [
            { name: 'Name', type : 'name' },
            { name: 'Date', type : 'date' }
        ];

        self.order_by_selected = self.order_by[1].type;


        //reset/set all the variables
        self.resetContact();

        //populate list of contacts
        self.contactsGetAll();
    },
    methods: {
        contactsGetAll(){
            var self = this;

            self.pager.total_records = 0;

            var data = {
                search_term: self.search_term, 
                contact_type: self.contact_type_default, 
                contact_order_by : self.order_by_selected,

                current_page : self.pager.current_page,
                limit : self.pager.limit
            };
            // data = JSON.stringify(data);

            var contList = $.post("/contacts/api/get/all", data);

            contList.done(function (data) {
                if(data.length > 0){
                    //self.contacts = JSON.parse(data);

                    self.contacts = data;

                    for(var i = 0; i< self.contacts.length; i++){
                        var link = self.contacts[i].address;
                        self.contacts[i].link = 'http://maps.google.com/maps?q=' + encodeURIComponent(link);               
                    }                   

                    //set total contact count
                    self.pager.total_records = self.contacts[0].total_contacts;
                }
            });

            contList.always(function () {
            });

            // // Prevent default posting of form
            //event.preventDefault();
        },
        contactAddOrEdit() {
            var self = this;

            //assign contact data
            var data = {
                id : self.contact_item.id,
                name : self.contact_item.name,
                address : self.contact_item.address,
                phone: self.contact_item.phone,
                email: self.contact_item.email,
                note: self.contact_item.note,
                contact_type : self.contact_type_selected,               
                csrf : $('#csrf').val()
            };

            //prepare data
            //data = JSON.stringify(data);

            //check if it's new item or update
            if (typeof self.contact_item.id == "undefined" || self.contact_item.id.length == 0 ) {           
                var result = $.post('/contacts/api/add', data);
            }
            else { //otherwise update existing contac
                //submit data and update contact
                var result = $.post('/contacts/api/update', data);
            }           

            //get results
            result.done(function (data){                

                //turn result into javascript workable variable
                //data = JSON.parse(data);

               if(data === true){                   
                    //Display a success toast, with a title
                    toastr.success("Contact has been successfully saved");   
                    
                    //reset variables
                    self.resetContact();

                    //load new uddated contact list
                    self.contactsGetAll();
               }
               else if(data == false) {                  
                    // Display an error toast, with a title
                    toastr.error("Ops! There has been problem with saving a contact...");
               }
            });

            result.always(function (data) {
            });
        },
        contactEditFormShow(index){
            var self = this;

            //copy object for editing
            self.contact_item = Object.assign({}, self.contacts[index] );

            //assign value for select box
            self.contact_type_selected = self.contact_item.type;

            //set action
            self.action = 'edit';
        },
        deleteContacModalShow(index){
            var self = this;           

            //assign value to delete contact object
            self.contact_delete = self.contacts[index];
            self.contact_delete.index = index;

            //show the modal
            $('#deleteModal').modal('show');

        },
        deleteContacModalHide(index){
            var self = this;           

            //show the modal
            $('#deleteModal').modal('hide');

            //reset variables
            self.resetContact();

        },
        deleteContact() {
            var self = this;

            //hide modal
            $('#deleteModal').modal('hide');

            var data = { id : self.contact_delete.id};           

            var del = $.post("/contacts/api/delete", data);

            del.done(function (data) {
                //if successfully removed remove from the local javascript array
               if(data == true){

                   //self.contacts.splice(self.contact_delete.index, 1);                

                    //Display a success toast, with a title
                    toastr.success("Selected contact has been successfully removed.");                                

                   //finally reset contact delete
                   self.resetContact();

                   //get updated contact list
                   self.contactsGetAll();
               }
               else if(data == false) {                                 
                   // Display an error toast, with a title
                   toastr.error("Ops..., there appears to be an issue with removing this contact");
               }
            });

            del.always(function () {
            });
        },
        //reset all local variables
        resetContact() {
            var self = this;

            self.contact_delete = {};

            self.contact_item = {
                id : '',
                name : '',
                address: '',
                phone: '',
                email: '',
                is_vendor : false
            };

            self.action = '';

            //reset pager
            self.pager = {
                current_page: 1,
                limit : 25,
                total_records : 0
            };
        }        
    }
};

const app = Vue.createApp(contacts)
                .mount('#contacts');