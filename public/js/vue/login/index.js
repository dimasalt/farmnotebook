var Login = new Vue({
    el: '#login-panel',
    data: {
        useremail : '',
        userpassword : '',
        alert : {
            error : false,
            message: ''
        }
    },
    created: function () {
    },
    methods: {
        dologin: function () {
            var self = this;

            if(this.useremail.length == 0)
                this.alert = {error: true, message: 'Email is required'};
            if(this.userpassword.length == 0)
                this.alert = {error: true, message: 'Password is required'};

            //dissable inputs
            $('input').prop( "disabled", true );

            //prepare data
            var data = { useremail : this.useremail, userpassword : this.userpassword };
            data = JSON.stringify(data); // $.param({ 'id': ticket_id });

            var loginpost = $.post( "/account/dologin", data);

            loginpost.done(function( data ) {
                //successfull login
                if(data.is_success == true)
                    window.location.href = '/';
                else if(data.is_success == false){
                    self.alert = {
                        error : true,
                        message : data.errors[0]
                    }
                }
            });

            loginpost.always(function () {
                // Reenable the inputs
                $('input').prop( "disabled", false );
            });



            // // Callback handler that will be called on failure
            // request.fail(function (jqXHR, textStatus, errorThrown){
            //     // Log the error to the console
            //     console.error(
            //         "The following error occurred: "+
            //         textStatus, errorThrown
            //     );
            // });


            // Prevent default posting of form
            event.preventDefault();
        }
    }
});