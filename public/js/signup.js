// const dotenv = require('dotenv');
// dotenv.config();
$(function () {
    var data = {};
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userID');
    $("#signup_form").submit(function (e) {
        e.preventDefault();
        var email = $('input#_email').val();
        var password = $('input#_password').val();
        var phone = $('input#_phone').val();
        var roleId = Number($('div#role_selector > select').val());
        showLoader(true)
        axios.post('/api/auth/signup', { email, password, phone, roleId })
            .then(function (response) {
                showLoader(false)
                console.log(response);
                showMessage(response);
            })
            .catch(function (error) {
                showLoader(false)
                console.log(error);
            });
    });

    showMessage = function (response) {
        $('#show_message').modal('show');
        $('#show_message').on('shown.bs.modal', function (e) {
            $('#message_content').text(response.data.message);
        })
        $('#show_message').on('hidden.bs.modal', function (e) {
            if (response.status === 208 || response.status === 200)
                window.location.pathname = "/login"
        })
    }
});
