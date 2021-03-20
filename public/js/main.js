$(function () {
    showMessage = function (response) {
        $('#show_message').modal('show');
        $('#show_message').on('shown.bs.modal', function (e) {
            $('#message_content').text(response.data.message);
        })
    }

    $('#show_message').on('hide.bs.modal', function (e) {
        $('#message_content').text("");
    })

    logout = function () {
        var userID = localStorage.getItem("userID");
        showLoader(true)
        axios.get(`api/auth/logout/${Number(userID)}`)
            .then(res => {
                showLoader(false)
                showMessage(res)
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userID');
                setTimeout(() => {
                    window.location.href = "/login"
                }, 3000)
            })
            .catch(err => {
                showLoader(false)
                showMessage(err.response);
            })
    }

    showLoader = function (status) {
        status ? $('div#page_loader').removeClass('d-none') : $('div#page_loader').addClass('d-none');
    }
});