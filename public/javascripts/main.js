var waitForQuery = setInterval(function() {
    if (window.jQuery) {
        main();
        clearInterval(waitForQuery);
    }
}, 100);

function main(){
    $(document).ready(function () {
        var element = $('meta[name="active-menu"]').attr('content');
        $('#' + element).addClass('active');
    });

    $('.form-minification').on('focus', function () {
        this.placeholder = '';
        $('#minified-container').css({
            'transform': 'scaleY(0)'
        });
    });

    $('.form-minification').on('blur', function () {
        this.placeholder = 'Enter the URL for minification';
    });


    $('#minification-submit').on('click', function () {
        if(!validURL($('.form-minification').val())){
             /* Update the view */
             $('#minify-result').attr("value", "This is not a valid URL");
 
             //Appear the result 
             $('#minified-container').css({
                 'transform': 'scaleY(1)'
             });
             return;
        }


        console.log('Minification Initiating');
        //Get URL to minify into JSON format
        let minifyThis = {
            urlToMinify: $('.form-minification').val()
        };

        //Send POST request to server with the value
        fetch('/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(minifyThis),
        }).then(function (resp) {
            if (resp.ok) {
                return resp.json();
            }
            throw new Error('Request failed.');
        }).then(function (data) {
            /* Update the view */            
            $('#minify-result').attr("value", "http://www.minify-me.com/" + data.id);

            //Appear the result 
            $('#minified-container').css({
                'transform': 'scaleY(1)'
            });
        }).catch(function (error) {
            console.log(error);
        });
    });

    function validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }
}
