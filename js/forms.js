var FORMS = (function($, window, document, undefined) {
    var pub = {};


    // Check or uncheck the custom Input and the actual (hidden) radio/checkbox input.
        // "checked" is a Boolean (to check or uncheck the fields).
    pub.toggleCustomInputField = function($customInput, $input, checked) {
        if ($customInput && ($customInput.hasClass('w--redirected-checked') !== checked)) {
            $customInput.trigger('click');
        }
        // Make sure the checkbox/radio reflects the same state as the custom input field...
        $input.prop('checked', checked);
    };


    //
    // International telephone inputs (intl-tel-input).
    // Country selector (flag + dial code) appears before each input[type="tel"].
    // Defaults to +44 (UK). Validates that a country code is set. Submits E.164.
    // Assets live in js/vendors/intl-tel-input and css/vendors/intl-tel-input.
    //
    var telSelectorResizeObserver;

    pub.getPublicRoot = function() {
        var src = ($('script[src*="/js/forms"]').attr('src') || '').split('?')[0];
        if (src) {
            return src.replace(/\/js\/forms[^/]*$/, '');
        }
        return '';
    };

    pub.initTelInputs = function() {
        var $telInputs = $('input[type="tel"]'),
            assetRoot = pub.getPublicRoot();

        if (!$telInputs.length) return;

        if (!document.getElementById('intl-tel-input-css')) {
            $('<link>', {
                id: 'intl-tel-input-css',
                rel: 'stylesheet',
                href: assetRoot + '/css/vendors/intl-tel-input/intlTelInput.css'
            }).appendTo(document.head);
        }
        if (window.intlTelInput) {
            pub.bindTelInputs($telInputs);
            return;
        }
        if (document.getElementById('intl-tel-input-js')) {
            HELP.waitFor(window, 'intlTelInput', 100, function() {
                pub.bindTelInputs($('input[type="tel"]'));
            });
            return;
        }
        var script = document.createElement('script');
        script.id = 'intl-tel-input-js';
        script.src = assetRoot + '/js/vendors/intl-tel-input/intlTelInputWithUtils.min.js';
        script.onload = function() {
            pub.bindTelInputs($('input[type="tel"]'));
        };
        document.head.appendChild(script);
    };

    pub.bindTelInputs = function($telInputs) {
        if (!window.intlTelInput) return;

        $telInputs.each(function() {
            var input = this;

            if (intlTelInput.getInstance(input)) {
                pub.syncTelInputValue(input);
                return;
            }
            intlTelInput(input, {
                initialCountry: 'gb',
                countryOrder: ['gb'],
                separateDialCode: true,
                strictMode: true,
                formatAsYouType: true,
                matchDropdownWidth: true
            });
            $(input).on('countrychange.iti input.iti', function() {
                input.setCustomValidity('');
                $(input).removeClass('input-error');
            });
            $(input).on('open:countryselector.iti', function() {
                pub.syncTelCountrySelectorWidth(input);
            });
            pub.observeTelInputLayout(input);
            pub.syncTelCountrySelectorWidth(input);
        });

        if (!window.ResizeObserver) {
            $(window).off('resize.iti').on('resize.iti', function() {
                pub.syncTelCountrySelectorWidth();
            });
        }
    };


    // intl-tel-input sets a one-time pixel width on .iti__country-selector.
    // Keep it matched to the field when the viewport (or container) changes.
    pub.syncTelCountrySelectorWidth = function(input) {
        var $wraps = input ? $(input).closest('.iti') : $('.iti');

        $wraps.each(function() {
            var $iti = $(this),
                $selector = $iti.find('.iti__country-selector'),
                width = $iti.outerWidth();

            if ($selector.length && width) {
                $selector[0].style.width = width + 'px';
            }
        });
    };


    pub.observeTelInputLayout = function(input) {
        var itiEl = input.closest('.iti');
        if (!itiEl || !window.ResizeObserver) return;

        if (!telSelectorResizeObserver) {
            telSelectorResizeObserver = new ResizeObserver(function(entries) {
                $.each(entries, function(i, entry) {
                    var tel = $(entry.target).find('input[type="tel"]').get(0);
                    if (tel) pub.syncTelCountrySelectorWidth(tel);
                });
            });
        }
        telSelectorResizeObserver.observe(itiEl);
    };

    pub.syncTelInputValue = function(input) {
        var iti = window.intlTelInput && intlTelInput.getInstance(input);
        if (iti && input.value) {
            iti.setNumber(input.value);
        }
    };

    // Validate country code and write the E.164 number onto the tel field
    // so native, AJAX, and Memberstack submits all send the same value.
    pub.prepareTelInputs = function($form) {
        var valid = true,
            firstInvalid;

        $form.find('input[type="tel"]').each(function() {
            var input = this,
                $input = $(input),
                iti = window.intlTelInput && intlTelInput.getInstance(input),
                hasValue = !!$.trim($input.val()),
                isRequired = input.required || $input.is('[required], .required');

            if (!iti) return;

            // Optional empty fields can be skipped.
            if (!hasValue && !isRequired) {
                input.setCustomValidity('');
                $input.removeClass('input-error');
                return;
            }
            var country = iti.getSelectedCountry();
            if (!country || !country.dialCode) {
                input.setCustomValidity('Please select a country code.');
                $input.addClass('input-error');
                valid = false;
                if (!firstInvalid) firstInvalid = input;
                return;
            }
            if (hasValue && typeof iti.isValidNumber === 'function' && !iti.isValidNumber()) {
                input.setCustomValidity('Please enter a valid phone number.');
                $input.addClass('input-error');
                valid = false;
                if (!firstInvalid) firstInvalid = input;
                return;
            }
            var e164 = iti.getNumber(intlTelInput.NUMBER_FORMAT.E164);
            if (hasValue && (!e164 || e164.indexOf('+' + country.dialCode) !== 0)) {
                input.setCustomValidity('Please select a country code.');
                $input.addClass('input-error');
                valid = false;
                if (!firstInvalid) firstInvalid = input;
                return;
            }
            input.setCustomValidity('');
            $input.removeClass('input-error');

            if (hasValue) {
                $input.data('iti-e164', e164);
                input.value = e164;
            }
        });
        if (!valid && firstInvalid && typeof firstInvalid.reportValidity === 'function') {
            firstInvalid.reportValidity();
        }
        return valid;
    };

    pub.restoreTelInputDisplay = function($form) {
        $form.find('input[type="tel"]').each(function() {
            var iti = window.intlTelInput && intlTelInput.getInstance(this),
                e164 = $(this).data('iti-e164');

            if (iti && e164) {
                iti.setNumber(e164);
            }
        });
    };
    // End of international telephone inputs (intl-tel-input).


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
        // AJAX Form submit listener.
        //
        $('.ajax-submit')
        .on('click', '.form-submit', function(e) {
            $(e.target).addClass('clicked');
        })
        .on('submit', function(e) {
            e.preventDefault();
            // Submit form via AJAX.
            ajaxSubmitHandler(e);
        });


        //
        // AJAX form submit logic.
        //
        const ajaxSubmitHandler = (event) => {
            var $form = $(event.target),
                $button = $form.find('.form-submit.clicked'),
                validation = $form.attr('data-validation'),
                dataType = $form.attr('data-form-values-type');

            // Custom form validation.
            if (validation && !HELP.callNestedFunction(validation)) {
                // Validation function retured false.
                console.log('Validation failed');
                MAIN.buttonThinking($button, true);
                // Don't proceed.
                return false;
            }

            // Country code + E.164 for telephone fields.
            if (!pub.prepareTelInputs($form)) {
                MAIN.buttonThinking($button, true);
                return false;
            }

            var data = HELP.getFormValues($form, dataType),
                formIncrement = HELP.getCookie('form-valid'),
                i = 2;

            formIncrement = !!formIncrement ? Number(formIncrement) : 0;
            formIncrement = ++formIncrement;

            if (dataType == 'formData') {
                data.set('increment', formIncrement);
            }
            else {
                data.increment = formIncrement;
            }
            HELP.setCookie('form-valid', formIncrement);

            var ajaxParams = {
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
            };
            // File upload fields break the JS without these settings.
            if (dataType == 'formData') {
                ajaxParams.processData = false;
                ajaxParams.contentType = false;
                ajaxParams.cache = false;
            }

            MAIN.buttonThinking($button);
            MAIN.thinking(true, false);
            console.log('data: ', ajaxParams.data);

            HELP.sendAJAX(ajaxParams, $form);

            // Put the visible tel input back into national format after serialising E.164.
            pub.restoreTelInputDisplay($form);
        };


        //
        // Set custom Radio/Checkbox states on page load.
        // Check custom Radio/Checkbox field's hidden <input> if the custom field is set the "checked".
            // IMPORTANT! Do this after the $('.input-default-value').each() (above) to check a value
            // if there's no .input-default-value set.
        //
        $('.w-form-formradioinput--inputType-custom').each(function() {
            var $customInput = $(this),
                $input = $customInput.siblings(':input'),
                checked = $customInput.hasClass('w--redirected-checked');

            // Update radio/checkbox state.
            if (checked) {
                pub.toggleCustomInputField($customInput, $input, checked);
            }
        });


        //
        // Form fields: Add maxlength attribute to fields.
        //
        $(':input[data-maxlength]').each(function() {
            $(this).attr('maxlength', HELP.sanitizeHTML( $(this).attr('data-maxlength') ));
        });


        //
        // Format DOB and other date fields on key press.
        //
        $('.format-ddmmyyyy').on('keyup', function(e) {
            if (e && !(e.key == 'Backspace' || e.key == 'Delete')) {
                $(this).val( HELP.formatDDMMYYYY($(this).val()) );
            }
        });


        //
        // Populate select fields with Collection List item values.
            // Keep the following 3 lines in this order to prevent a bug
            // with the register profile forms not playing nice with
            // select fields and setting default values/saving values to
            // Memberstack Custom Fields...
        //
        $('.select-list-options').buildSelectOptions();// #1


        //
        // Form fields: Populate field's default values with inline attribute's value.
        //
        $(':input[data-default-value]').inputAttrDefaultValue();// #2
        

        //
        // Form fields: Populate field's default values with sibling DIV's content.
        //
        $('.input-default-value').inputDefaultValue();// #3


        //
        // Telephone fields: country selector before each input[type="tel"].
        //
        pub.initTelInputs();
        USER.getCurrentMember(function() {
            if (!$('input[type="tel"]').length) return;

            HELP.waitFor(window, 'intlTelInput', 100, function() {
                $('input[type="tel"]').each(function() {
                    pub.syncTelInputValue(this);
                });
            });
        });
        document.addEventListener('submit', function(e) {
            var form = e.target;
            if (!form || form.tagName !== 'FORM' || !$(form).find('input[type="tel"]').length) return;

            if (!pub.prepareTelInputs($(form))) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }, true);
    });

    return pub;
}(jQuery, this, this.document));



//
// Extend jQuery.
//

//
// Form fields: Populate field's default values with inline attribute's value.
//
$.fn.inputAttrDefaultValue = function() {
    $(this).each(function() {
        var $el = $(this),
            val = $el.attr('data-default-value');

        if (!$el.val()) {
            // Remove non-number characters from value so it can be set as a value.
            if ($el.attr('type') == 'number') {
                val = HELP.removeNonNumeric(val);
            }
            $el.val(HELP.sanitizeHTML(val)).trigger('change');
        }
    })
};


//
// Form fields: Populate field's default values with sibling DIV's content.
//
$.fn.inputDefaultValue = function() {
    $(this).each(function() {
        var $el = $(this),
            text = $el.text(),
            $input = $el.parents('.input-wrapper').find(':input'),
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
                // Update radio/checkbox state.
                FORMS.toggleCustomInputField($customInput, $(this), bool);
            });
        }
        else if (!$input.val()) {
            if ($input.hasClass('editor')) {
                // Add raw HTML to input (textarea.editor).
                $input.val($el.html());
            }
            else {
                // Add basic text with newlines.
                $input.val( HELP.stripHTMLWithLinebreaks($el.html()) );
            }
            $input.trigger('change');
        }
        // If we don't remove this element the register/profile form's MS select fields
        // don't get saved...
        $el.remove();
    });
};


//
// Form fields: Populate select with option elements built from WF Collection List data.
//
$.fn.buildSelectOptions = function(options) {
    options = options || {};

    $.each(this, function(i, el) {
        var wrapper = $(this).parent('.select-list-wrapper'),
            $select = $('select', wrapper),
            $default = $('.input-default-value', wrapper),
            defaultValue = HELP.sanitizeHTML(!!$default.text() ? $default.text() : $default.attr('data-value')) || '',
            values = [],
            isMultiSelect = $select.is('select[multiple]');

        if (isMultiSelect) {
            defaultValue = defaultValue.split('|');
        }

        $(this).find('.w-dyn-item').each(function() {
            var val = $.trim($(this).text()),
                selected = (val == defaultValue) ? 'selected' : false;

            if (isMultiSelect) {
                selected = ($.inArray(val, defaultValue) > -1);
            }

            if (!val || $.inArray(val, values) > -1) return;// Skip empty or duplicate values.
            values.push(val);

            $('<option />', {
                value: val,
                selected: selected
            }).text(val).appendTo( $select );
        });
        $select.trigger('change');
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


FORMS.registerValidation = function() {
    document.addEventListener("DOMContentLoaded", function() {
        // Check if the browser supports HTML5 validation
        var testInput = document.createElement("input");
        testInput.setAttribute("required", "required");

        if (!("checkValidity" in testInput) || !testInput.checkValidity()) {
            //HTML5 validation not supported. Loading jQuery Validation plugin...
            var scriptValidation = document.createElement("script");
            scriptValidation.src = "https://cdn.jsdelivr.net/npm/jquery-validation@1.19.5/dist/jquery.validate.min.js";
            scriptValidation.onload = function() {
                console.log("jQuery Validation plugin loaded.");
                applyValidation();
            };
            document.head.appendChild(scriptValidation);
        }

        function applyValidation() {
            var $form = $(".form-register");
            $form.validate({
                errorClass: "error",
                errorElement: "span",
                highlight: function(element) {
                    $(element).addClass("input-error");
                },
                unhighlight: function(element) {
                    $(element).removeClass("input-error");
                }
            });
            return $form.valid();
        }
    });
    return true;
};

