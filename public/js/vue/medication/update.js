const UpdateMedication = {
    data() {     
        return {
            medication: {}     
        }
    },
    mounted () {
        var self = this;

        //populate list of medications
        self.getMedication();
    },
    methods: {      
        getMedication(){     //gets one medication item
            var self = this;

            var id = $('#id').val();

            var data = {id : id};
            data = JSON.stringify(data);

            var medOne = $.post("/medication/getOne", data);

            medOne.done(function (data) {
                if(data.length > 0)
                    self.medication = JSON.parse(data);
            });

            medOne.always(function () {
            });          
        },       
        updateMed(){
            var self = this;            

            let data = {
                id : self.medication.id,
                med_name : self.medication.name,             
                med_desc:  tinymce.get("med_desc").getContent(),
                med_instruction: tinymce.get("med_instr").getContent(),
                med_price : self.medication.price,
                on_hand_doses : self.medication.on_hand_doses,
                csrf : $('#csrf').val()
            };

            //example of reading only text
            //   med_desc:  tinymce.get("med_desc").getContent({ format: "text"}),

            data = JSON.stringify(data);

            var result = $.post("/medication/update/action", data);

            result.done(function (data) {
                
               self.medication = {} ;

               data = JSON.parse(data);
                //if successfully removed remove from the local javascript array
               if(data == true){
                    self.getMedication();

                    //Display a success toast, with a title
                    toastr.success("Selected medication has been successfully removed.");                                                   
               }
               else if(data == false) {                                 
                   // Display an error toast, with a title
                   toastr.error("Ops..., there appears to be an issue with removing this medication item");
               }
            });

            result.always(function () {
            });
        }
    }
};

const app = Vue.createApp(UpdateMedication)
                .mount('#medication');