/*Global:$*/
/**
 * Created by laszlojuracz on 4/1/14.
 */
$(function() {
    "use strict";

    var captchaShown = false,
        returnedError = false,

        validate,
        validatEmail,

        $name = $('#name-field'),
        $email = $('#email-field'),
        $message = $('.message');


    validatEmail = function(x) {
        var atpos=x.indexOf("@");
        var dotpos=x.lastIndexOf(".");
        if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length)
        {
          return false;
        } else {
          return true;
        }
    };

    validate = function(setMessage) {

        var result = true,
            $recaptcha = $('#recaptcha_response_field');

        $message.html('');
        result = result && $name.val().length > 1;
        if (result) {
            $name.removeClass('error');
        } else {
            if (setMessage === true || returnedError === true) {
                $name.addClass('error');
            }
        }

        result = result && $recaptcha.val().length > 1;
        if (result) {
            $recaptcha.removeClass('error');
        } else {
            if (setMessage === true || returnedError === true) {
                $recaptcha.addClass('error');
            }
        }

        result = result && validatEmail($email.val());
        if (result) {
            $email.removeClass('error');
        } else {
            if (setMessage === true || returnedError === true) {
                $email.addClass('error');
            }
        }

        if (result) {
            $message.removeClass('error');
        } else {
            if (setMessage === true || returnedError === true) {
                $message.html('Invalid values!');
                $message.addClass('error');                
            }            
        }

        return result;

    };

    $('.fancybox').fancybox({
        padding : 0,
        openEffect  : 'elastic'
    });

    $('form input').focus(function(){

        function capcthaIsReady() {
            $('#recaptcha_response_field').attr('style', '');
            $('#recaptcha-holder').fadeIn(1000);
            $('#submit-button').fadeIn(1000);
            
            $('form input[type=text]').keyup(function() {
               validate();
            });

            $('form input[type=email]').keyup(function() {
               validate();
            });

        }

        if (captchaShown === false) {
            Recaptcha.create('6Lf0GPESAAAAANkosxMm9DyYwxjZko3FsPPHr6ZX',
                'recaptcha-holder',
                {
                  theme: 'clean',
                  callback: capcthaIsReady
                }
            );

            captchaShown = true;
        }
    });


    (function() {
        function beforeSubmit() {
            return validate(true);
        }

        // post-submit callback
        function showResponse(responseText, statusText, xhr, $form)  {
            console.log(responseText);

            $message.addClass(responseText.status);
            $message.html(responseText.message);

            if ($.isArray(responseText.fields)) {
                $.each(responseText.fields, function(k, v) {
                    console.log(v);
                    $('#' + v).addClass('error');
                });
            }

            returnedError = responseText.status === 'error';

            if (returnedError === false) {
                $('form input[type=text]').val('');
                $('form input[type=email]').val('');
            }

        }

        var options = {
            dataType: 'json',
            beforeSubmit:  beforeSubmit,  // pre-submit callback
            success:       showResponse  // post-submit callback

            // other available options:
            //url:       url         // override for form's 'action' attribute
            //type:      type        // 'get' or 'post', override for form's 'method' attribute
            //dataType:  null        // 'xml', 'script', or 'json' (expected server response type)
            //clearForm: true        // clear all form fields after successful submit
            //resetForm: true        // reset the form after successful submit

            // $.ajax options can be used here too, for example:
            //timeout:   3000
        };

        // bind form using 'ajaxForm'
        $('#signupform').ajaxForm(options);
    })();

});