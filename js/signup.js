
var backend_ip='127.0.0.1:8000'

function logoClick(lang="EN") {
    window.location.href = "login.html";
}

function emailsignClick() {
    window.location.href = "sign-up-screen-email.html";
}


function registerSubmitForm(lang='EN') {
    var form = $("#register_form");
    $( "form" ).on( "submit", function( event ) {
        //console.log("hello")
       // console.log( $( this ).serializeArray() );
        event.preventDefault();
      } );

  

    
  //  pwd = serialize_array[2]["value"]
    // // confirm_pwd = serialize_array[3]["value"]
    //email=form.serializeArray()[1]['value']

    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:8000/register/',
        data: form.serializeArray(),
        dataType: "text",
        success: function (response) {
            tmp_response = $.parseJSON(response)
            window.localStorage.setItem('login_click', 0);
            window.localStorage.setItem('username', tmp_response["username"]);
            window.localStorage.setItem('user_id', tmp_response["id"]);
            window.localStorage.setItem('token', tmp_response["token"]);
            // window.localStorage.setItem('user_pricing_tier', tmp_response["pricing_tier"]);
            // window.localStorage.setItem('user_trial_count', tmp_response["trial_count"]);
            window.localStorage.setItem('user_email', tmp_response["email"]);
            if (lang=="EN") {
                window.location.replace('/index.html');
            } else if (lang=="CN") {
                window.location.replace('/index-cn.html');
            }
        },
        error: function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network. Or Server is down, please wait.';
            } else if (jqXHR.status == 401) {
                msg = 'Wrong username or password.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 406) {
                error_response = $.parseJSON(jqXHR.responseText)
                var errors = $.parseJSON(error_response["errors"]);
                for (var key in errors) {
                    msg += errors[key][0]["message"]
                    msg += ' '
                }
            }
            else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            document.getElementById("register_form_fail").innerHTML = msg
            document.getElementById("register_form_fail").style.color = "red"
        }
    });
}