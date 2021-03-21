function sortBy(value) {
    console.log('sort by ===> ', value);
    window.location.href = '/?sortBy=' + value;
}

function goToSong() {
    var songInput = $('input#song_number').val();
    if (isNaN(songInput) || Number(songInput) <= 0 || Number(songInput) > 710) {
        $('p#error_song_number').removeClass('d-none').text('invalid number')
        return
    }
    window.location.href = '/' + songInput.toString();
}
