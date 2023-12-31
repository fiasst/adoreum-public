var PROFILE = (function($, window, document, undefined) {
    var pub = {};
  

    $(function() {
        //
        // Motive and Diet fields.
        //
        $('#field-motive, #field-diet').on('change', function() {
            // Filter multi-select options.
            var selected = $("option:selected", this).filter(function() {
                    return $(this).text() === "Other";
                }),
                field = ($(this).attr('id') == 'field-motive') ? 'motive' : 'diet';

            $(`#${field}-other-wrapper`).toggleClass('hide', (selected.length < 1));
        })
        // Init.
        .trigger('change');



        //
        // Handle MS "Custom Field" Select fields.
        //
        $('.form-profile-fields :input:not(.ignore)').on('change', function() {
            // Filter multi-select options.
            var val = $(this).val();

            if ($(this).is('select[multiple]')) {
                // Remove empty option values from array.
                val = $.grep(val, n => n === 0 || n).join('|');
            }
            $(this).parents('.input-wrapper').find('.input-custom-field').val(val);
        })
        // Init.
        .trigger('change');
    });


    return pub;
}(jQuery, this, this.document));

