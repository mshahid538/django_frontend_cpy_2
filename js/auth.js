
// Credential response handler function
 function handleCredentialResponse(response,lang='EN'){
    
        if (response.credential) {
          var id_token = response.credential;
          $.ajax({
          type: 'POST',
          url:  'http://127.0.0.1:8000/custom/',
          data: {'id_token':id_token},
          dataType: "text",
          success: function (response) {
              parse_response = $.parseJSON(response)
              username=parse_response['username']
              token=parse_response['token']
              user_id=parse_response['id']
              user_pricing_tier=parse_response['pricing_tier']
              user_email=parse_response['email']

  
              if (username != null) {
                  window.localStorage.setItem('username', username);
                  window.localStorage.setItem('token', token);
                  window.localStorage.setItem('user_id', user_id);
                  window.localStorage.setItem('user_pricing_tier', user_pricing_tier);
                  window.localStorage.setItem('user_trial_count', parse_response["trial_count"]);
                  window.localStorage.setItem('user_email', user_email);
                  window.localStorage.setItem('user_login', true);
  
                  if (lang=="EN") {
                      window.location.replace('/index.html');
                  } 
                  else if (lang=="CN") {
                       window.location.replace('/index-cn.html');
                   }
              } 
              document.getElementById("toastbody").textContent = "Success"
              document.getElementById("toastbody").classList.add("text-success")
              
              window.location.replace('/')
          },
          error: function (jqXHR, exception) {
             // document.getElementById("login_id").value = "Login"
              var msg = '';
              if (jqXHR.status === 0) {
                  msg = 'Server is down, please wait.';
              } else if (jqXHR.status == 401) {
                  msg = 'Wrong username or password.'; 
              } else if (jqXHR.status == 404) {
                  msg = 'Email doesnot exists. [404]';
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
              
              document.getElementById("toastbody").textContent = "Some Error: "+msg
              document.getElementById("toastbody").classList.add("text-danger");
          }
      });
  
        }
      

}
