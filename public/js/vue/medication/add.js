const UpdateMedication = {  
    data() {        
        return {
            medication: {
                med_name: '',
                med_desc: '',
                med_instruction: '',
                med_price: 0,
                med_on_hand: 0,           
                med_img: 'https://via.placeholder.com/250x200.jpg'
            }       
        } 
    },
    mounted () {
        var self = this;        
    },
    methods: {             
        addMedication(){
            var self = this;
                        
            let data = {
                id : self.medication.id,
                med_name : self.medication.med_name,             
                med_desc:  tinymce.get("med_desc").getContent(),
                med_instruction: tinymce.get("med_instr").getContent(),
                med_price : self.medication.med_price,
                med_on_hand : self.medication.med_on_hand,
                csrf : $('#csrf').val()
            };
           
            //prepare data for php          
            data = JSON.stringify(data);

            var addMed = $.post("/medication/add/action", data);

            addMed.done(function (data) {                     
               data = JSON.parse(data);

                //if successfully added 
               if(data.result == true){  

                    //Display a success toast, with a title
                    toastr.success("Medication item has been successfully added. <br /> You will be redirected to an update page in 5 seconds...");    
                    
                    //window.location.href = '/medication/update/{id}';                                               
                    setTimeout(function(){
                        window.location.href="/medication/update/" + data.id; // The URL that will be redirected too.
                    }, 5000); // The bigger the number the longer the delay.
               }
               else if(data == false) {                                 
                   // Display an error toast, with a title
                   toastr.error("Ops..., there appears to be an issue with adding this medication item");
               }
            });

            addMed.always(function () {
            });
        }
    }
};

const app = Vue.createApp(UpdateMedication)
                .mount('#medication');