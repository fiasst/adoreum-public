var FORMS = (function($, window, document, undefined) {
    var pub = {};


    //
    // On DOM ready.
    //
    $(function() {
        // Get current Member.
        USER.getCurrentMember(function(member) {
            if (HELP.checkKeyExists(member, 'id')) {
                // Add member ID to form field.
                var hiddenInput = $('.input-member-id');

                if (!!hiddenInput && !hiddenInput.val()) {
                    hiddenInput.val(member.id);
                    hiddenInput.parents('form').find('.form-submit').removeAttr('disabled');
                }
            }
        });


        //
        // Redirect user after form submit.
        //
        const queryDest = HELP.getSetQuerystring('dest');
        if (queryDest) {
            $('form').find('.fp_redirect').attr('data-redirect', '/'+queryDest);// Relative URIs only.
        }
        $('form').on('submit', function() {
            var redir = $(this).find('.fp_redirect').attr('data-redirect');
            if (!!(redir)) {
                localStorage.setItem('fp_redirect', redir);
            }
        });


        //
        //  General AJAX form submit handler.
        //
        $('.ajax-submit')
            .on('click', '.form-submit', function(e) {
                $(e.target).addClass('clicked');
            })
            .on('submit', function(e) {
                e.preventDefault();
                var $form = $(this),
                    $button = $form.find('.form-submit.clicked'),
                    validation = $form.attr('data-validation');

                // Custom form validation.
                if (validation && !HELP.callNestedFunction(validation)) {
                    // Validation function retured false.
                    console.log('Validation failed');
                    MAIN.buttonThinking($button, true);
                    // Don't proceed.
                    return false;
                }

                var data = HELP.getFormValues($form),
                    formIncrement = HELP.getCookie('form-valid'),
                    i = 2;

                formIncrement = !!formIncrement ? Number(formIncrement) : 0;
                data.increment = ++formIncrement;
                HELP.setCookie('form-valid', data.increment);

                MAIN.buttonThinking($button);
                MAIN.thinking(true, false);
                console.log(data);

                HELP.sendAJAX({
                    url: $form.attr('action'),
                    method: $form.attr('method'),
                    data: data,
                    timeout: 120000,
                    callbackSuccess: function(data) {
                        MAIN.thinking(false);
                        MAIN.handleAjaxResponse(data, $form);
                    },
                    callbackError: function(data) {
                        MAIN.thinking(false);
                        console.log('error');
                    }
                }, $form);
            });


        //
        // Form fields: Populate field's default values with inline attribute's value.
        //
        $(':input[data-default-value]').each(function() {
            var $el = $(this),
                val = $el.attr('data-default-value');

            if (!$el.val()) {
                // Remove non-number characters from value so it can be set as a value.
                if ($el.attr('type') == 'number') val = HELP.removeNonNumeric(val);
                $el.val( HELP.sanitizeHTML(val) );
            }
        });


        //
        // Form fields: Populate field's default values with sibling DIV's content.
        //
        $('.input-default-value').each(function() {
            var $el = $(this),
                text = $el.text(),
                $input = $el.parent().find(':input'),
                type = $input.eq(0).attr('type');

            if (type == 'checkbox' || type == 'radio') {
                $input.each(function() {
                    var $customInput = $(this).siblings(`.w-${type}-input`),
                        // If text of the .input-default-value matches the radio's value.
                        bool = !!text && text == $(this).val();

                    if (type == 'checkbox') {
                        // bool value can either be empty, for non-Switch WF fields
                        //or "true/false" (String), for Switch WF fields.
                        bool = !!text && text !== "false";
                    }

                    if ($customInput && ($customInput.hasClass('w--redirected-checked') !== bool)) {
                        $customInput.trigger('click');
                    }
                    // Make sure the checkbox/radio reflects the same state as the custom input field...
                    $(this).prop('checked', bool);
                });
            }
            else if (!$input.val()) {
                $input.val( HELP.stripHTMLWithLinebreaks($el.html()) );
            }
        });


        //
        // Form fields: Add maxlength attribute to fields.
        //
        $(':input[data-maxlength]').each(function() {
            $(this).attr('maxlength', HELP.sanitizeHTML( $(this).attr('data-maxlength') ));
        });


        //
        // Must appear before the createSelect2() call.
        //
        $('.select-list-options').buildSelectOptions();


        //
        // Register form validation.
        //
        HELP.waitFor(window.jQuery.fn, "validate", 400, function() {
            $('#wf-form-Register-Form').validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    }
                },
                messages: {
                    email: {
                        required: "Email is required",
                        email: "Must be a valid email address"
                    }
                }
            });
        });
    });

    return pub;
}(jQuery, this, this.document));



//
// Extend jQuery.
//
//
// Form fields: Populate select with option elements built from WF Collection List data.
//
$.fn.buildSelectOptions = function(options) {
    options = options || {};

    $.each(this, function(i, el) {
        var wrapper = $(this).parent('.select-list-wrapper'),
            select = $('select', wrapper),
            $default = $('.input-default-value', wrapper),
            defaultValue = HELP.sanitizeHTML(!!$default.text() ? $default.text() : $default.attr('data-value')) || '',
            values = [],
            isMultiSelect = select.is('select[multiple]');

        if (isMultiSelect) {
            defaultValue = defaultValue.split('|');
        }

        $(this).find('.w-dyn-item').each(function() {
            var val = $(this).text(),
                selected = (val == defaultValue) ? 'selected' : false;

            if (isMultiSelect) {
                selected = ($.inArray(val, defaultValue) > -1);
            }

            if (!val || $.inArray(val, values) > -1) return;// Skip empty or duplicate values.
            values.push(val);

            $('<option />', {
                value: val,
                selected: selected
            }).text(val).appendTo( $(select) );
        });
    });
};


//
// Form element has value/is selected or is checked, selector ":selectedInput".
//
jQuery.expr[':'].selectedInput = (el, i, m) => {
    var exclude = ['submit', 'button', 'reset', 'hidden'];

    if (el.type == 'checkbox' || el.type == 'radio') {
        return el.checked;
    }
    else if (exclude.indexOf(el.type) < 0) {
        return el.value;
    }
    return false;
};



