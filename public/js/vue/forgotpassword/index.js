var ForgotPassword = new Vue({
    el: '#forgot-password',
    data: {
        useremail : '',
        crf : '',
        alert : {
            error : false,
            success: false,
            message: ''
        }
    },
    created: function () {
        self.crf = $('#csrf').val();
    },
    methods: {
        getpassword: function () {
            var self = this;

            $('#loader').show(); //show loader
            $('input').prop( "disabled", true );

            if(this.useremail.length == 0)
                this.alert = {error: true, message: 'Email is required'};


            //prepare data
            var data = { useremail : self.useremail, csrf: self.csrf };
            data = JSON.stringify(data); // $.param({ 'id': ticket_id });

            var loginpost = $.post( "/account/getpassword", data);

            loginpost.done(function( data ) {
                if (data.is_success == true) {
                    self.alert = { success: true, message: data.message };
                }
                else if (data.is_success == false) {
                    self.alert = { error: true, message: data.message };
                }
            });

            loginpost.always(function () {
                $('input').prop( "disabled", false );
                $('#loader').hide();
            });


            // Prevent default posting of form
            event.preventDefault();
        }
    }
});