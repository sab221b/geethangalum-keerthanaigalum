$(document).ready(function () {
    console.log("ready!");
    var defautFontsize = 1.5;
    setFontSize(defautFontsize);
    var $r = $('input[type="range"]');
    var $ruler = $('<div class="rangeslider__ruler" />');
    if (!isNaN(window.location.pathname.replace('/', '')))
        $('input#song_number').attr("placeholder", "பாடல் எண்: " + window.location.pathname.replace('/', ''));

    // Initialize
    $r.rangeslider({
        polyfill: false,
        onInit: function () {
            $ruler[0].innerHTML = getRulerRange(this.min, this.max, this.step);
            this.$range.prepend($ruler);
        }
    }).on('input', function (event) {
        $('p#font_size').text('font-size: ' + event.target.value + ' rem');
        setFontSize(event.target.value);
    });

    function getRulerRange(min, max, step) {
        var range = '';
        var i = min;

        while (i <= max) {
            range += i + ' ';
            i = i + step;
        }
        return range;
    }

})

function sortBy(value) {
    window.location.href = '/?sortBy=' + value;
}

function goToSong() {
    event.preventDefault();
    var songInput = $('input#song_number').val();
    if (isNaN(songInput) || Number(songInput) <= 0 || Number(songInput) > 720) {
        $('p#error_song_number').removeClass('d-none').text('invalid number')
        return
    }
    window.location.href = '/' + songInput.toString();
}

function setFontSize(fontSize) {
    $('table thead tr th').css({ fontSize: fontSize + 'rem' });
    $('table tbody tr td').css({ fontSize: fontSize + 'rem' });
    $('ul.tamil-font li').css({ fontSize: fontSize + 'rem' });
}