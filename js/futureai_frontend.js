// backend_ip = "http://127.0.0.1:8000";
backend_ip = "localhost:8000";


function productSubmitForm(lang='EN') {
    if (localStorage.getItem("country")==="CN") {
        return
    }

    var form = $("#product_form");

    document.getElementById("product_desc_submit_button").style.display = "none";

    document.getElementById("gen_results").style.display = "none";
    document.getElementById("loading_anime").style.display = "inline";
    document.getElementById("submit_form_fail").style.display = "none";

    // clean up thumb up/down 
    total_len = localStorage.length
    for (var i = 0; i < total_len; i++){
        cur_key = localStorage.key(i)
        if (cur_key == null) continue
        if (cur_key.includes("thumb")) {
            if (!cur_key.includes("click") && (cur_key.includes("up") || cur_key.includes("down"))) {
                document.getElementById(cur_key).style.backgroundColor = "rgba(146, 226, 169, 0.18)";
            }
            localStorage.setItem(cur_key, 0)
        }
    }
    serial_form = form.serializeArray()
    brand_name = serial_form[1].value

    if (!/^[a-zA-Z\s\"\'\\\&\.\,]+$/.test(brand_name)) {
        document.getElementById("loading_anime").style.display = "none";
        document.getElementById("submit_form_fail").style.display = "inline";
        if (lang=='EN') {
            document.getElementById("submit_form_fail").innerHTML = "Brand name must be in English";
        } else if (lang == 'CN') {
            document.getElementById("submit_form_fail").innerHTML = "品牌名称必须是英文";
        }
        document.getElementById("product_desc_submit_button").style.display = "inline";
        return   
    }
    $.ajax({
        type: 'POST',
        url: backend_ip+'/copywriting/product_desc/',
        headers: {
            'Authorization': 'Token '+localStorage.getItem("token"),
        },
        data:form.serializeArray(),
        dataType: "text",
        success: function (response) {

            document.getElementById("product_desc_submit_button").style.display = "inline";
            document.getElementById("loading_anime").style.display = "none";

            document.getElementById("gen_results").style.display = "block";
            
            parsed_response = $.parseJSON(response)

            product_result = parsed_response["result"]
            product_result_ids = parsed_response["product_desc_ids"]
            user_trial_count = parsed_response["trial_count"]

            result_len = product_result.length;
            window.localStorage.setItem("result_len", result_len)
            window.localStorage.setItem("user_trial_count", user_trial_count)

            for (let i = 0; i < result_len; i++) {
                id = String(i + 1)
                ai_ouput_name = 'ai_output_' + id;
                result_name = 'result_' + id;

                ai_output_id = "ai_output_" + id
                like_button_id = "thumb_up_" + id
                dislike_button_id = "thumb_down_" + id
                copy_button_id = "copy_image_" + id
                edit_button_id = "edit_button_" + id
                save_button_id = "save_button_" + id
            
                document.getElementById(ai_output_id).setAttribute("contenteditable", false);
                document.getElementById(edit_button_id).style.display = "inline-flex";
                document.getElementById(like_button_id).style.display = "inline-flex";
                document.getElementById(dislike_button_id).style.display = "inline-flex";
                document.getElementById(copy_button_id).style.display = "inline-flex";
                document.getElementById(save_button_id).style.display = "none";
            
                document.getElementById(result_name).style.display = "block";
                document.getElementById(ai_ouput_name).innerHTML = product_result[i];

                gen_result_name = 'gen_result_' + id;
                gen_id_name = 'gen_id_' + id;
                window.localStorage.setItem(gen_result_name, product_result[i])
                window.localStorage.setItem(gen_id_name, product_result_ids[i])
            }

            for (let i = 0; i < 10; i++) {
                if (i < result_len) continue;
                result_name = 'result_' + String(i + 1);
                document.getElementById(result_name).style.display = "none";
            }
        },
        error: function(XMLHttpRequest, textStatus, error) {
            error_response = $.parseJSON(XMLHttpRequest.responseText)
            error_msg = error_response["msg"]
            error_detail = error_response["detail"]

            if (error_detail === "Invalid token") {
                document.getElementById("loading_anime").style.display = "none";
                document.getElementById("submit_form_fail").style.display = "inline";
                if (lang=='EN') {
                    document.getElementById("submit_form_fail").innerHTML = "Please log in.";
                } else if (lang == 'CN') {
                    document.getElementById("submit_form_fail").innerHTML = "请重新登录";
                }
                redirect_url = "/login.html"
                if (lang=="CN") {
                    redirect_url = "/login_cn.html"
                }
                window.setTimeout(function(){
                    window.location.href = redirect_url;
            
                }, 1000);
                localStorage.clear();
                return
            }

            if (error_msg === "wrong parameters") {
                document.getElementById("product_desc_submit_button").style.display = "inline";
                document.getElementById("loading_anime").style.display = "none";
    
                document.getElementById("submit_form_fail").style.display = "inline";
                if (lang=='EN') {
                    document.getElementById("submit_form_fail").innerHTML = "Form is not filled in correctly.";
                } else if (lang == 'CN') {
                    document.getElementById("submit_form_fail").innerHTML = "表格填写不正确。";
                }
            } else if (error_msg === "usage limit reached") {
                document.getElementById("loading_anime").style.display = "none";
                document.getElementById("submit_form_fail").style.display = "inline";
                if (lang=='EN') {
                    document.getElementById("submit_form_fail").innerHTML = "You have reached the usage limit.Please contact our support for more free trials.";
                } else if (lang == 'CN') {
                    document.getElementById("submit_form_fail").innerHTML = "<br>您已经达到了使用上限。请联系微信：<a href='wechat_qrcode.html'>jasonw_2018 </a>或者<a href='survey_cn_tmp.html'>填写调查问卷</a>可以获得至少10次免费试用。</br>";
                }
                localStorage.setItem('user_trial_count',0)
            }

         }    
    });
}

function registerSubmitForm(lang="EN") {
    var form = $("#register_form");
    serialize_array = form.serializeArray()
    pwd = serialize_array[2]["value"]
    confirm_pwd = serialize_array[3]["value"]

    email=form.serializeArray()[1]['value']
    document.getElementById("register_form_fail").style.backgroundColor = "#92e2a9"

    if (pwd != confirm_pwd) {
        document.getElementById("register_form_fail").innerHTML = "Password doesn't match."
        document.getElementById("register_form_fail").style.color = "red"
    } else {
        $.ajax({
            type: 'POST',
            url: backend_ip+'/register/',
            data: form.serializeArray(),
            dataType: "text",
            success: function (response) {
                tmp_response = $.parseJSON(response)
                window.localStorage.setItem('login_click', 0);
                window.localStorage.setItem('username', tmp_response["username"]);
                window.localStorage.setItem('user_id', tmp_response["id"]);
                window.localStorage.setItem('token', tmp_response["token"]);
                window.localStorage.setItem('user_pricing_tier', tmp_response["pricing_tier"]);
                window.localStorage.setItem('user_trial_count', tmp_response["trial_count"]);
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
}

function loginSubmitForm(lang="EN") {
    console.log("hello")
    var form = $("#login_form");
    document.getElementById("login_form_status").style.backgroundColor = "#92e2a9"
    document.getElementById("login_id").value = "Logging in..."

    $.ajax({
        type: 'POST',
        url:  'https:127.0.0.1:8000/login/',
        data: form.serializeArray(),
        dataType: "text",
        success: function (response) {
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
                // else if (lang=="CN") {
                //     window.location.replace('/index-cn.html');
                // }
            } 
        },
        error: function (jqXHR, exception) {
            document.getElementById("login_id").value = "Login"
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
            document.getElementById("login_form_status").innerHTML = msg
            document.getElementById("login_form_status").style.color = "red"
            document.getElementById("login_form_status").style.display = "block";
        }
    });
}

function contactSubmitForm() {
    var form = $("#contact_form");
    $.ajax({
        type: 'POST',
        url: backend_ip + '/contact/',
        data: form.serializeArray(),
        dataType: "text",
        success: function (response) {
            parsed_response = $.parseJSON(response)
            document.getElementById("contact_form_fail").style.backgroundColor = "MediumSeaGreen"
            document.getElementById("contact_form_fail").innerHTML = parsed_response["msg"]
        }
    });
}

function checkLoginstatus() {
    if (localStorage.getItem("username") != null) {
        localStorage.clear();
        localStorage.setItem("redirect_index", true)
    }
}

function saveProfileSubmit() {
    var form = $("#profile_form");
    backend_url = backend_ip+'/users/' + localStorage.getItem("user_id") + '/update_user_info/'
    $.ajax({
        type: 'POST',
        headers: {
            'Authorization': 'Token '+localStorage.getItem("token"),
        },
        url: backend_url,
        data: form.serializeArray(),
        dataType: "text",
        success: function (response) {
            document.getElementById("update_form").style.backgroundColor = "MediumSeaGreen"
            document.getElementById("update_form").innerHTML = "Profile updated"
            tmp_response = $.parseJSON(response)
            window.localStorage.setItem('username', tmp_response["username"]);
            window.localStorage.setItem('user_id', tmp_response["id"]);
            window.localStorage.setItem('token', tmp_response["token"]);
            window.localStorage.setItem('user_pricing_tier', tmp_response["pricing_tier"]);
            window.localStorage.setItem('user_trial_count', tmp_response["trial_count"]);
            window.localStorage.setItem('user_email', tmp_response["email"]);           

        },
        error: function(XMLHttpRequest, textStatus, error) {
            error_response = $.parseJSON(XMLHttpRequest.responseText)
            document.getElementById("update_form").style.backgroundColor = "Red"
            document.getElementById("update_form").innerHTML = "Username not found"
        }
    });
}

function registerClick(lang="EN") {
    window.location.href = "sign-up-screen.html";
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function copyClick(index, lang="EN") {
    ai_ouput_name = "ai_output_" + index
    gen_id_name = 'gen_id_' + String(index);
    product_desc_id = localStorage.getItem(gen_id_name)
    
    image_name ="copy_image_" + index
    copyText = document.getElementById(ai_ouput_name).innerHTML
    navigator.clipboard.writeText(copyText);
    imageText = document.getElementById(image_name).getElementsByClassName("button-text")[0]
    copied = "Copied";
    copy = "Copy"
    if (lang == "CN") {
        copied = "已复制";
        copy = "复制";
    }
    imageText.textContent = copied;
    setTimeout(function () {
        imageText.textContent = copy;
    }, 1000)
    console.log("Copied the text: " + copyText);
    
    $.ajax({
        type: 'POST',
        headers: {
            'Authorization': 'Token '+localStorage.getItem("token"),
        },
        url: backend_ip + '/copywriting/product_desc_copy/',
        data: {
            product_desc_id: product_desc_id,
        },
    });
}


function thumbClick(index, thumb_icon) {
    gen_id_name = 'gen_id_' + String(index);
    product_desc_id = localStorage.getItem(gen_id_name)
    thumb_id = "thumb_" + thumb_icon + "_" + String(index);
    thumb_id_click = thumb_id + "_click"

    if (localStorage.getItem(thumb_id) > 0) {
        if (localStorage.getItem(thumb_id_click) > 0) {
            document.getElementById(thumb_id).style.backgroundColor = "rgba(146, 226, 169, 0.18)";
            localStorage.setItem(thumb_id_click, 0)
        }
        else {
            document.getElementById(thumb_id).style.backgroundColor = "#3cb371"
            localStorage.setItem(thumb_id_click, 1)
        }
    } else {
        document.getElementById(thumb_id).style.backgroundColor = "#3cb371"
        $.ajax({
            type: 'POST',
            headers: {
                'Authorization': 'Token '+localStorage.getItem("token"),
            },
            url: backend_ip+'/copywriting/product_desc_thumb/',
            data: {
                thumb: thumb_icon,
                product_desc_id: product_desc_id,
            },
            success: function (response) {
                localStorage.setItem(thumb_id, 1)
                localStorage.setItem(thumb_id_click, 1)
            }
        });
    }
}

function getUsername(lang="EN") {
    $.ajax({
        type: 'GET',
        url: 'https://ssl.geoplugin.net/json.gp?k=7233ec4ee8862db0',
        success: function (response) {
        }
    }).then ( function(response) {
        country_code = response.geoplugin_countryCode
        if (country_code == 'CN') {
            localStorage.setItem("country", "CN")
            return
        }
        localStorage.setItem("time_zone", response.geoplugin_timezone);
        if (lang=='EN' && country_code == 'CN') {
            window.location.replace('/index-cn.html');
            return
        }
    }
    );
}

function checkUserProfileValid(lang="EN") {
    if (localStorage.getItem("username") == null) {
        if (lang=="EN") {
            window.location.replace('/index.html');
        } else if (lang=="CN") {
            window.location.replace('/index-cn.html');
        }
    } 
}

function editClick(id) {
    edit_button_id = "edit_button_" + id
    save_button_id = "save_button_" + id
    gen_result_id = "gen_result_" + id
    like_button_id = "thumb_up_" + id
    dislike_button_id = "thumb_down_" + id
    copy_button_id = "copy_image_" + id
    ai_output_id = "ai_output_" + id
    result_form_id = "result_form_" + id
    result_text_id = "result_text_" + id
    gen_id_name = 'gen_id_' + String(id);

    document.getElementById(like_button_id).style.display = "none";
    document.getElementById(dislike_button_id).style.display = "none";
    document.getElementById(copy_button_id).style.display = "none";

    document.getElementById(edit_button_id).style.display = "none";
    document.getElementById(save_button_id).style.display = "inline-flex";
    document.getElementById(ai_output_id).setAttribute("contenteditable", true);
}

function saveClick(id) {
    ai_output_id = "ai_output_" + id
    like_button_id = "thumb_up_" + id
    dislike_button_id = "thumb_down_" + id
    copy_button_id = "copy_image_" + id
    edit_button_id = "edit_button_" + id
    save_button_id = "save_button_" + id
    gen_id_name = 'gen_id_' + String(id);
    product_desc_id = localStorage.getItem(gen_id_name)

    document.getElementById(ai_output_id).setAttribute("contenteditable", false);
    document.getElementById(edit_button_id).style.display = "inline-flex";
    document.getElementById(like_button_id).style.display = "inline-flex";
    document.getElementById(dislike_button_id).style.display = "inline-flex";
    document.getElementById(copy_button_id).style.display = "inline-flex";
    document.getElementById(save_button_id).style.display = "none";

    new_text = document.getElementById(ai_output_id).innerHTML
    $.ajax({
        type: 'POST',
        headers: {
            'Authorization': 'Token '+localStorage.getItem("token"),
        },
        url: backend_ip+'/copywriting/product_desc_edit/',
        data: {
            result: new_text,
            product_desc_id: product_desc_id,
        },
        success: function (response) {
            console.log('Saved')
        }
    });
}

function logoClick(lang="EN") {
    if (lang=="EN") {
        window.location.replace('/index.html');
    } else if (lang=="CN") {
        window.location.replace('/index-cn.html');
    }
}


function userprofileClick(lang="EN") {
    if (lang == "EN") {
        window.location.href = "user-profile.html";
    } else if (lang == "CN"){
        window.location.href = "user-profile_cn.html";
    }
}

function dashboardClick(lang="EN") {
    if (lang == "EN") {
        window.location.href = "analytic-dashboard.html";
    } else if (lang == "CN"){
        // window.location.href = "dashboard.html";
        alert("近期上线，敬请期待！")
    }  
}

function postClick(id, lang="EN") {
    if (lang == "CN") {
        alert("近期上线，敬请期待！")
        return
    }

    if (localStorage.getItem("fb_access_token") != null) {
        const ai_output_id = "ai_output_" + id;
        const desc = document.getElementById(ai_output_id).innerHTML
        window.location.href = "instagram_upload.html?desc=" + desc;
    }
    else {
        window.location.href = "analytic-dashboard.html";
    }
}