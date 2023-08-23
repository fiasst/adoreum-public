var PROFILE = (function($, window, document, undefined) {
    var pub = {};
  

    $(function() {
        //
        // Motive field.
        //
        // Change listener.
        $('#field-motive').on('change', function() {
            // Filter multi-select options.
            var selected = $("option:selected", this).filter(function() {
                    return $(this).text() === "Other";
                });
            console.log(selected);

            $('#motive-other-wrapper').toggleClass('hide', (selected.length < 1));
        })
        // Init.
        .trigger('change');


        //
        // Diet field.
        //
        // Change listener.
        $('#field-diet').on('change', function() {
            var selected = $("option:selected", this).text() == "Other";

            $('#diet-other-wrapper').toggleClass('hide', !selected);
        })
        // Init.
        .trigger('change');
    });


    return pub;
}(jQuery, this, this.document));

