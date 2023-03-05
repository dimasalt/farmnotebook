const budget = {
    data() {
        return {
            budget_start_item: {},
            budget_item : {},       
            budgets: [],
            budget_total: {
                predicted_expences: 0,
                actual_expences: 0,
                predicted_expences_class: "",
                actual_expences_class: ""
            },
            chart_data : [], //data for the charts
            myChart : {},
            budget_drpdown : [],
            budget_selected : 0
        }
    },
    created() {
        var self = this;
      
        self.getDropDownSelections();
    },
    methods: {
        getBudget() {
            //gets all project items
            var self = this;

            //clear all variables
            self.resetVariables();

            var data = {id : self.budget_selected};
            data = JSON.stringify(data);

            var result = $.post("/bookkeeping/budget/get/all", data);

            result.done(function (data) {
                if (data.length > 0) {                  

                    data = JSON.parse(data);

                    //Create USD currency formatter.
                    var formatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    });                  

                    for (var i = 0; i < data.length; i++) {

                        //check for red or green success class styling
                        if (data[i].budget_amount < 0) data[i].class = "text-danger";
                        else if (data[i].budget_amount > 0) data[i].class = "text-success";

                        //convert money to familiar usd format                       
                        data[i].budget_amount_formated =  formatter.format(data[i].budget_amount); 
                        data[i].budget_amount_actual_formated = formatter.format(data[i].budget_amount_actual); 

                        //check if project is done
                        if(data[i].is_done == 1){
                            data[i].class = data[i].class + ' ' + "remove-line";
                            data[i].checked = true;
                        }
                        else data[i].checked = false;

                        //check for start point
                        if (data[i].is_default == 1 || data[i].parent_id == 0) {
                            self.budget_start_item = data[i];                                                       
                        }
                        else {
                              //set edit to invisible
                            data[i].is_edit = false;

                            //populate budgets list
                            self.budgets.push(data[i]);      
                        }

                        //calculate predicted and actual expences
                        self.budget_total.predicted_expences = self.budget_total.predicted_expences + parseInt(data[i].budget_amount);
                        self.budget_total.actual_expences = self.budget_total.actual_expences + parseInt(data[i].budget_amount_actual);                                                                                       
                    }                                                                                           

                    //format total numbers to usd currency
                    self.budget_total.predicted_expences_formated = formatter.format(self.budget_total.predicted_expences);
                    self.budget_total.actual_expences_formated = formatter.format(self.budget_total.actual_expences);                   
                }
                     

                //assign information for the chart
                self.chart_data = data;
                self.chartJSLine();                        
            });

            result.always(function () { });
        },
        getDropDownSelections() {
            //gets all project items
            var self = this;     

            //reset dropdown
            self.budget_drpdown = [];          
  
            var data = {};
            data = JSON.stringify(data);
  
            var result = $.post("/bookkeeping/budget/get/getdropdownselections", data);
  
            result.done(function (data) {
                if (data.length > 0) {                  
  
                    data = JSON.parse(data);                                         
  
                    let is_default = false;
                    for (var i = 0; i < data.length; i++) {  
  
                       //add to drop down                                               
                        self.budget_drpdown.push(data[i]);       
                        
                        if(data[i].is_default == 1 && is_default == false)
                        {
                            is_default = true;
                            self.budget_selected = data[i].id;
                        }
                    }

                    //if no default found choose the very first item as default
                    if(is_default == false) self.budget_selected = data[0].id;
                    
                    //get all the rest of the records
                    self.getBudget();
                }                                 
            });
  
            result.always(function () { });
        },
        budgetCreateItem (is_default) {          
            var self = this;            

            //hide new project form
            self.budget_item.is_new = false;
           
            //set an actual expence if none been inserted
            if(self.budget_item.budget_amount_actual == '')            
                self.budget_item.budget_amount_actual = 0;        

            //assign parent id
            if(is_default == 1 || typeof self.budget_start_item.id === 'undefined')
                self.budget_item.parent_id = 0;
            else self.budget_item.parent_id = self.budget_start_item.id;


            //create data to send to controller
            var data = self.budget_item;                        
            
            data.is_default = is_default;
            data.csrf = $('#csrf').val();  

            data = JSON.stringify(data);

            var result = $.post("/bookkeeping/budget/add", data);

            result.done(function (data) {
                data = JSON.parse(data);             

                //if element has been added
                if (data.id > 0) {                           

                    //get all the budget items from database
                    self.getBudget();

                    //Display a success toast, with a title
                    toastr.success("You have successfully added new budget item");                
                }
                else if(data == 0){ //otherwise display error
                    // Display an error toast, with a title
                    toastr.error("Ops! There appears to be an error and budget item coudln't be added");
                }            
            });

            result.always(function () { });
        },  
        budgetDeleteModalShow: function (budget_item){ 
            //show remove item modal
            var self = this;
            
            //assing item to remove
            self.budget_item = budget_item;

            //show the modal
             $('#deleteModal').modal('show');
        },  
        budgetDelete () { 
            //remove one project item
            var self = this;

            //hide modal
            $('#deleteModal').modal('hide');

            var data = { 
                id: self.budget_item.id,
                csrf : $('#csrf').val()
            };
            data = JSON.stringify(data);

            var result = $.post("/bookkeeping/budget/delete", data);

            result.done(function (data) {
                data = JSON.parse(data);             

                if (data == true) {
                 
                    //if main item reload all
                    if(self.budget_item.parent_id == 0){

                        //reload dropdown list and budgets
                        self.getDropDownSelections();
                    }//otherwise reload just items
                    else self.getBudget();

                    //Display a success toast, with a title
                    toastr.success("You have successfully removed selected item");                
                }
                else if(data == false){
                    // Display an error toast, with a title
                    toastr.error("Ops! There appears to be an error and selected item coudln't t be removed");
                }   
            });

            result.always(function () { });
        },            
        budgetUpdateFormShow(index){ //displays edit forms
            var self = this;

            //close any open edit forms
            for(var i = 0; i < self.budgets.length; i++)
                self.budgets[i].is_edit = false;

            //display edit forms
            self.budgets[index].is_edit = true;

            //assing values
            self.budget_item = Object.assign({}, self.budgets[index]);
        },     
        budgetUpdate (index) {
            //remove one project item
            var self = this;   
            
            var data = self.budget_item;   
            data.csrf = $('#csrf').val();
            

            data = JSON.stringify(data);
           
            //close any open edit forms
            for(var i = 0; i < self.budgets.length; i++)
                self.budgets[i].is_edit = false;           

            var result = $.post("/bookkeeping/budget/update", data);

            result.done(function (data) {
                data = JSON.parse(data);             

                if (data == true) {                   
                    //reset abd load budgets again                    
                    self.getBudget();

                    //Display a success toast, with a title
                    toastr.success("You have successfully updated selected project");                
                }
                else if(data == false){
                    // Display an error toast, with a title
                    toastr.error("Ops! There appears to be an error and project coudln't be updated");
                }
                
                //call charts
                self.chartJSLine();
            });

            result.always(function () { });
        },
        budgetUpdateStatus (id, index) {
            //remove one project item
            var self = this;   
            
            //set data variable
            var data;

            data = {
                id : id,
                csrf : $('#csrf').val()
            };

            if(self.budgets[index].checked == true)
                data.is_done = 1;
            else data.is_done = 0;                                      

            data = JSON.stringify(data);                    

            var result = $.post("/bookkeeping/budget/update/status", data);

            result.done(function (data) {
                data = JSON.parse(data);             

                if (data == true) {                  

                    //reset abd load budgets again                    
                    self.getBudget();

                    //Display a success toast, with a title
                    toastr.success("You have successfully updated selected project status");                
                }
                else if(data == false){
                    // Display an error toast, with a title
                    toastr.error("Ops! There appears to be an error and project status coudln't be updated");
                }            
            });

            result.always(function () { });
        },                
        chartJSLine (){               
            
            var self = this;                          
                
            /**
             * ---------------------------------------------------------------------------------
             * To be honest, though, in cases like yours, I have often used a container div to wrap my canvas and, 
             * whenever I needed to create a new chart, I placed a new canvas element in this div. I then used this 
             * newly created canvas for the new chart. If you ever come across strange behavior, possibly related to 
             * charts occupying the canvas before the current chart, have this approach in mind too.
             * ---------------------------------------------------------------------------------
             */
            
            //remove old canvas and create new
            $('#canvas_line').remove();
            $('#chart_wrapper').append('<canvas id="canvas_line" class="shadow-sm mt-2"  style="background-color:white;"></canvas>');

            //assing data for labels and datasets
            var data_predicted = [], data_actual = [];            
            for(var i = 0; i < self.chart_data.length; i++){
                //labels.push(self.chart_data[i].planning_name);

                if(data_predicted.length == 0 && data_actual.length == 0){
                    data_predicted.push({ x: self.chart_data[i].budget_date, y: self.chart_data[i].budget_amount  });
                    data_actual.push({ x: self.chart_data[i].budget_date, y: self.chart_data[i].budget_amount_actual  });
                }
                else 
                {
                    var sum_predicted = parseInt(self.chart_data[i].budget_amount) + parseInt(data_predicted[i-1].y); 
                    data_predicted.push({ x: self.chart_data[i].budget_date, y: sum_predicted  });

                    var sum_actual = parseInt(self.chart_data[i].budget_amount_actual) + parseInt(data_actual[i-1].y); 
                    data_actual.push({ x: self.chart_data[i].budget_date, y: sum_actual });
                }

            }

            var timeFormat = 'YYYY/MM/DD';
            
            var config = {
                type: 'line',
                data: {
                    //labels: labels,
                    datasets: [{
                            label: 'Projected',                                
                            backgroundColor : "#FF0000",                
                            borderColor: "#FF0000",
                            borderDash: [5, 5],
                            borderWidth : 2,
                            tension : 0.5,                    
                            fill: false,
                            data: data_predicted
                        },
                        {
                            label: 'Actual',                                
                            backgroundColor : "#008000",                
                            borderColor: "#008000",
                            borderDash: [5, 5],
                            borderWidth : 2,   
                            tension : 0.5,                             
                            fill: false,
                            data: data_actual
                        }
                    ]},
                    options: {
                        responsive: true,
                        // title: {
                        //     text: 'Projected and Actual expenses',
                        //     display: true
                        // }
                        // scales:     {
                        //     xAxes: [{
                        //         type:       "time",
                        //         distribution: 'series',
                        //         time:       
                        //         {
                        //             format: timeFormat,
                        //             tooltipFormat: 'll'
                        //         },
                        //         scaleLabel: {
                        //             display:     true,
                        //             labelString: 'Date'
                        //         }
                        //     }],
                        //     yAxes: [{
                        //         scaleLabel: {
                        //             display:     true,
                        //             labelString: '$'
                        //         }
                        // }]
                    // }
                }
            };  
            

            // Chart.defaults.global.defaultFontFamily =  'Source Sans Pro';
            // Chart.defaults.global.defaultFontColor =  '#000000';
            
            var ctx = document.getElementById("canvas_line").getContext("2d");
            self.myChart = new Chart(ctx, config);           
        },  
        budgetSelectionChange () {
            var self = this;

            if(self.budget_selected == 0){
                //reset variables
                self.resetVariables();            
            }
            else { //otherwise get information
                self.getBudget();
            }            
        },         
        /**
         * ------------------------------------------------------
         * reset most of the current script variables
         * ------------------------------------------------------
         */
        resetVariables(){
            var self = this;

            //clear list of budgets and total calculations
            self.budget_start_item = {};  

            self.budgets = [];
            self.budget_total.predicted_expences = 0;
            self.budget_total.actual_expences = 0;

            //reset budget dropdown list
            //self.budget_drpdown = [];


             // Use new Date() to generate a new Date object containing the current date and time.
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            
            //self.budget_item.created_at = yyyy + '-' + mm + '-' + dd;     

            self.budget_item = {
                id : 0,
                parent_id : 0,
                budget_amount : 0,
                budget_amount_actual : 0,
                is_default : 0,
                is_done : 0,
                budget_date : yyyy + '-' + mm + '-' + dd,
                is_new : false
            }; 
            
            //reset chart data
            self.chart_data = [];

            //reset totals for current budget
            self.budget_total= {
                predicted_expences: 0,
                actual_expences: 0,
                predicted_expences_class: "",
                actual_expences_class: ""
            };
        }
    }
};

const app = Vue.createApp(budget)
                .mount('#budget');
