$(function () {
  var signupData = $('#page_data').attr('value')
  var signupResponse = {}
  if (signupData.length) {
    try {
      signupResponse['data'] = JSON.parse(signupData)
      if (signupResponse.data.message && signupResponse.data.access_token) {
        showMessage(signupResponse);
        localStorage.setItem('accessToken', signupResponse.data.access_token)
        localStorage.setItem('userID', signupResponse.data.userID)
        setTimeout(() => {
          window.location.href = "/home"
        }, 2000)
      }
    } catch (error) {
      console.log('error-getting-signup-data', error)
    }
  } else {
    var accessToken = localStorage.getItem('accessToken');
    if (accessToken && accessToken !== 'null') {
      showLoader(true)
      axios.get('api/auth/verify-token', {
        headers: {
          authorization: 'Bearer ' + accessToken
        }
      })
        .then(function (response) {
          showLoader(false)
          showMessage(response)
          if (response.data.userID)
            setTimeout(() => {
              window.location.href = "/home"
            }, 2000)
        })
        .catch(function (error) {
          showLoader(false)
          showMessage(response)
        });
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userID');
    }
  }
  $("#login_form").submit(function (e) {
    e.preventDefault();
    var login_cred = $('input#email_mobile').val();
    var login_pass = $('input#login_password').val();
    var isEmail;
    var login_cred_valid = false;
    var login_pass_valid = false;
    if (!login_cred.replace(/ /g, "").length) {
      $('#login_cred_error').text('Email or phone is required').removeClass('d-none');
      login_cred_valid = false;
    } else {
      if (isNaN(login_cred)) {
        //email
        isEmail = true;
        if (!validateEmail(login_cred)) {
          $('#login_cred_error').text('Email is invalid').removeClass('d-none');
          login_cred_valid = false;
        } else {
          $('#login_cred_error').text('').addClass('d-none');
          login_cred_valid = true;
        }
      } else if (!isNaN(login_cred)) {
        // phone number 
        if (login_cred.length !== 12 && login_cred.length > 0) {
          $('#login_cred_error').text('Phone number is invalid').removeClass('d-none');
          login_cred_valid = false;
        } else {
          $('#login_cred_error').text('').addClass('d-none');
          login_cred_valid = true;
        }
      }
    }
    // password vaidation 
    if (!login_pass.replace(/ /g, "").length) {
      $('#login_pass_error').text('Password is required').removeClass('d-none');
      login_pass_valid = false;
    } else {
      if (login_pass.length < 6 || login_pass.length > 18) {
        $('#login_pass_error').text('Password is invalid').removeClass('d-none');
        login_pass_valid = false;
      } else {
        $('#login_pass_error').text('').addClass('d-none');
        login_pass_valid = true;
      }
    }

    if (login_cred_valid && login_pass_valid) {
      showLoader(true)
      axios.post('/api/auth/login', {
        [isEmail ? 'email' : 'phone']: login_cred,
        password: login_pass
      })
        .then(function (response) {
          showLoader(false)
          if (response.status === 200)
            showOtpPopup(response);
          else
            showMessage(response)
        })
        .catch(function (error) {
          showLoader(false)
          showMessage(error.response)
        });
    }
  });
});

verifyOTP = function (e) {
  e.preventDefault();
  var login_cred = $('input#email_mobile').val();
  var otp_dgt_1 = $('input#otp_dgt_1').val();
  var otp_dgt_2 = $('input#otp_dgt_2').val();
  var otp_dgt_3 = $('input#otp_dgt_3').val();
  var otp_dgt_4 = $('input#otp_dgt_4').val();
  var isEmail = isNaN(login_cred)
  var otp = String(otp_dgt_1) + String(otp_dgt_2) + String(otp_dgt_3) + String(otp_dgt_4);
  if (otp.length === 4) {
    $('#login_otp_error').text('').addClass('d-none');
    $('#otp_popup').modal('hide');
    showLoader(true)
    axios.post('/api/auth/otp', {
      [isEmail ? 'email' : 'phone']: login_cred,
      [isEmail ? 'emailOTP' : 'phoneOTP']: otp
    })
      .then(function (response) {
        showLoader(false)
        showMessage(response);
        if (response.data.access_token) {
          localStorage.setItem('accessToken', response.data.access_token)
          localStorage.setItem('userID', response.data.userID)
          setTimeout(() => {
            window.location.href = "/home"
          }, 2000)
        }
      })
      .catch(function (error) {
        showLoader(false)
        showMessage(response)
      });
  } else {
    $('#login_otp_error').text('invalid OTP').removeClass('d-none');
  }
}

showMessage = function (response) {
  $('#show_message').modal('show');
  $('#show_message').on('shown.bs.modal', function (e) {
    $('#message_content').text(response.data.message);
  })
}

showOtpPopup = function (response) {
  $('#otp_popup').modal('show');
  $('#otp_popup').on('shown.bs.modal', function (e) {
    $('#email_otp_message').text(response.data.message);
  })
}


function validateEmail(email) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
}