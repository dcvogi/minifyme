var jqueryWait = setInterval(function() {
    if (window.jQuery) {
      tracking();
      clearInterval(jqueryWait);
    }
}, 100);

function tracking(){
    var $ = window.jQuery;

    $('#minification-submit').on('click', function () {
        ga('analyticsTracker.send', 'event', 'main form', 'submit attempt',  $('input.form-minification').val())
    });
}