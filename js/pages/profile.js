var PROFILE = (function($, window, document, undefined) {
    var pub = {};
  

    $(function() {
        //
        // Motive and Diet fields.
        //
        // Change listener.
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
    });


    return pub;
}(jQuery, this, this.document));

