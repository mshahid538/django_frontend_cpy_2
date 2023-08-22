function passwordReset(){

    var email =$("#email").val()||window.localStorage.getItem('email')
    window.localStorage.setItem('email',email)

    $.ajax({
    type: 'POST',
    url:  'http://127.0.0.1:8000/contact/',
    data: {name:"Astroy",email:email,message:"some message"},
    dataType: "text",
    success: function (response) {
        window.localStorage.setItem('sendReset',true) 

    },
    error: function (jqXHR, exception) {
       // document.getElementById("login_id").value = "Login"
        var msg = '';
        if (jqXHR.status === 0) {
            msg = 'Server is down, please wait.';
        } else if (jqXHR.status == 401) {
            msg = 'Wrong username or password.'; 
        } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
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
      alert("Faced some error:",msg)
    }
    
});
}

  
function resetNow(){
    var email =window.localStorage.getItem('email')
    $( "form" ).on( "submit", function( event ) {
        //onsole.log("hello")
       // console.log( $( this ).serializeArray() );
        event.preventDefault();
      } );
   
    var form = $("#resetform");
    var password =$("#password-input").val()
var confirmpassword=$("#confirmpassword-input").val()
    console.log(form.serializeArray())
    $.ajax({
    type: 'POST',
    url:  'http://127.0.0.1:8000/custom/reset/',
    data: {email:email,password:password,confirm:confirmpassword},
    dataType: "text",
    success: function (response) {
        window.localStorage.setItem('sendReset',true) 

    },
    error: function (jqXHR, exception) {
       // document.getElementById("login_id").value = "Login"
        var msg = '';
        if (jqXHR.status === 0) {
            msg = 'Server is down, please wait.';
        } else if (jqXHR.status == 401) {
            msg = 'Wrong username or password.'; 
        } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
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
      alert("Faced some error:",msg)
    }
    
});
}