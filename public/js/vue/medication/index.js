const Medication = {   
    data() {
        return {
            meds : [],
            medication: {},     
            search_term: '',
            action : ''          
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
            
            self.getList();
        },
        setAction(action, index){
            let self = this;

            self.action = action;

            self.medication = {
                id: '',
                name: '',
                desc: '',
                instruction: '',
                img: 'https://via.placeholder.com/250x200.jpg',
                price: '',
                on_hand_doses: ''
            };

            //assign object to item
            if(action == 'edit'){               
                self.medication = JSON.parse(JSON.stringify(self.meds[index]));
            }

        },
        getList(){ //gets all medication items
            var self = this;

            var data = {search_term : self.search_term };          
            var medList = $.post("/medication/api/get/all", data);

            medList.done(function (data) {
                if(data.length > 0){

                    //data = data

                    for(var i=0; i < data.length; i++)
                        data[i].selected = "Description";                    

                    self.meds = data;                                          
                }                
            });

            medList.always(function () {
            });
        },
        addEditMedication(){
            var self = this;
                        
            let data = {
                id : self.medication.id,
                name : self.medication.name,             
                desc:  self.medication.desc,
                instruction: self.medication.instruction,
                price : self.medication.price,
                on_hand_doses : self.medication.on_hand_doses,             
            };
                  
            if(typeof self.medication.id == "undefined" || self.medication.id.length == 0)
                var result = $.post("/medication/api/add", data); //add new
            else 
                var result = $.post("/medication/api/update", data);

                result.done(function (data) {                                 

                //if successfully added 
               if(data.result == true){  

                    //Display a success toast, with a title
                    toastr.success("Medication item has been successfully added/updated.");   
                    
                    if(self.action == 'edit')
                    {
                        for(var i = 0; i < self.meds.length; i++){
                            if(self.meds[i].id == self.medication.id)
                                self.meds[i] = JSON.parse(JSON.stringify(self.medication));
                        }
                    }
                    else if(self.action == 'new')
                    {
                        self.meds.push(self.medication);
                    }
                                                                                  
                    // setTimeout(function(){
                    //     window.location.href="/medication/update/" + data.id; // The URL that will be redirected too.
                    // }, 5000); // The bigger the number the longer the delay.
               }
               else if(data == false) {                                 
                   // Display an error toast, with a title
                   toastr.error("Ops..., there appears to be an issue with adding/updating this medication item");
               }
            });

            result.always(function () {
            });
        },
        // updateMed(){
        //     var self = this;            

        //     let data = {
        //         id : self.medication.id,
        //         med_name : self.medication.name,             
        //         med_desc:  tinymce.get("med_desc").getContent(),
        //         med_instruction: tinymce.get("med_instr").getContent(),
        //         med_price : self.medication.price,
        //         on_hand_doses : self.medication.on_hand_doses,
        //         csrf : $('#csrf').val()
        //     };

        //     //example of reading only text
        //     //   med_desc:  tinymce.get("med_desc").getContent({ format: "text"}),

        //     data = JSON.stringify(data);

        //     var result = $.post("/api/update/", data);

        //     result.done(function (data) {
                
        //        self.medication = {} ;

        //        data = JSON.parse(data);
        //         //if successfully removed remove from the local javascript array
        //        if(data == true){
        //             self.getMedication();

        //             //Display a success toast, with a title
        //             toastr.success("Selected medication has been successfully removed.");                                                   
        //        }
        //        else if(data == false) {                                 
        //            // Display an error toast, with a title
        //            toastr.error("Ops..., there appears to be an issue with removing this medication item");
        //        }
        //     });

        //     result.always(function () {
        //     });
        // },
        // getOne(){     //gets one medication item
        //     var self = this;

        //     var data = {};
        //     data = JSON.stringify(data);

        //     var medOne = $.post("/medication/getOne", data);

        //     medOne.done(function (data) {
        //         if(data.length > 0)
        //             self.meds = JSON.parse(data);
        //     });

        //     medOne.always(function () {
        //     });          
        // },
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

              var del = $.post("/medication/api/delete", data);

              del.done(function (data) {
                
               self.medication = {} ;
              
                //if successfully removed remove from the local javascript array
               if(data.result == true){
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