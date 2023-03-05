const Medication = {   
    data() {
        return {
            meds : [],
            medication: {},     
            search_term: ''
        }
    },
    created () {
        var self = this;

        //populate list of medications
        self.getList();
    },
    methods: {
        goSearch (){
            var self = this;

            // if(self.search_term.length >= 2)
            self.getList();
        },
        getList(){ //gets all medication items
            var self = this;

            var data = {search_term : self.search_term };
            data = JSON.stringify(data);

            var medList = $.post("/medication/getList", data);

            medList.done(function (data) {
                if(data.length > 0){
                    
                    data = JSON.parse(data);

                    //data = data

                    for(var i=0; i < data.length; i++)
                        data[i].selected = "Description";                    

                    self.meds = data;                                          
                }                
            });

            medList.always(function () {
            });


            // // Prevent default posting of form
            //event.preventDefault();
        },
        getOne(){     //gets one medication item
            var self = this;

            var data = {};
            data = JSON.stringify(data);

            var medOne = $.post("/medication/getOne", data);

            medOne.done(function (data) {
                if(data.length > 0)
                    self.meds = JSON.parse(data);
            });

            medOne.always(function () {
            });          
        },
        deleteMedicationModal(index){
            var self = this;

            self.medication = self.meds[index];

             //show the modal
             $('#deleteModal').modal('show');

        },
        deleteMedicationModalHide(){
            var self = this;

            self.medication = {};

            //show the modal
            $('#deleteModal').modal('hide');
        },
        deleteMedication(){
            var self = this;

              //hide the modal
              $('#deleteModal').modal('hide');

              var data = {id : self.medication.id };

              data = JSON.stringify(data);

              var del = $.post("/medication/delete", data);

              del.done(function (data) {
                
               self.medication = {} ;

               data = JSON.parse(data);
                //if successfully removed remove from the local javascript array
               if(data == true){
                    self.getList();

                    //Display a success toast, with a title
                    toastr.success("Selected medication has been successfully removed.");                                                   
               }
               else if(data == false) {                                 
                   // Display an error toast, with a title
                   toastr.error("Ops..., there appears to be an issue with removing this medication item");
               }
            });

            del.always(function () {
            });
        }
    }
};

const app = Vue.createApp(Medication)
                .mount('#medication');