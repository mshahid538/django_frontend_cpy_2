
// Credential response handler function
 function handleCredentialResponse(response){
// http://127.0.0.1:8000/accounts/google/login/callback/
    // Post JWT token to server-side
    
//     fetch("http://127.0.0.1:8000/googleoauth/" ,{
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ request_type:'user_auth', credential: response.credential }),
//     })
//     .then(response => {console.log(response);response.json()})
//     .then(data => {
//       console.log(data)
//         if(data.status == 1){
//             let responsePayload = data.pdata;

//             // Display the user account data
//             let profileHTML = '<h3>Welcome '+responsePayload.given_name+'! <a href="javascript:void(0);" onclick="signOut('+responsePayload.sub+');">Sign out</a></h3>';
//             profileHTML += '<img src="'+responsePayload.picture+'"/><p><b>Auth ID: </b>'+responsePayload.sub+'</p><p><b>Name: </b>'+responsePayload.name+'</p><p><b>Email: </b>'+responsePayload.email+'</p>';
//             document.getElementsByClassName("pro-data")[0].innerHTML = profileHTML;
            
//             document.querySelector("#btnWrap").classList.add("hidden");
//             document.querySelector(".pro-data").classList.remove("hidden");
//         }

        
//     })
//    .catch(console.error);
     //Performing ajax request to googleoauth which basically acts as a proxy to real google auth request to prevent cors problem 
$.ajax({
    type: 'POST',
    url:  'http://127.0.0.1:8000/googleoauth/',
    data: JSON.stringify({ request_type:'user_auth', credential: response.credential }),
    dataType: "text",
    success: function (response) {
        console.log(response)
        parse_response = $.parseJSON(response)
        username = parse_response["username"]
        token = parse_response["token"]
        user_id = parse_response["id"]

        if (username != null) {
            window.localStorage.setItem('username', username);
            window.localStorage.setItem('token', token);
            window.localStorage.setItem('user_id', user_id);
            window.localStorage.setItem('user_pricing_tier', parse_response["pricing_tier"]);
            window.localStorage.setItem('user_trial_count', parse_response["trial_count"]);
            window.localStorage.setItem('user_email', parse_response["email"]);
            
            if (lang=="EN") {
                window.location.replace('/index.html');
            } 
            else if (lang=="CN") {
                 window.location.replace('/index-cn.html');
            }
            window.Location.replace('/')
        } 
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
        alert(" error occured: "+msg) 

    }
});
 
}
