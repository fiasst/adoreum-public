var PLANS = (function($, window, document, undefined) {
    var pub = {};

    
    //
    // On DOM ready.
    //
    $(function() {
        //
        // Plan frequency toggle switch (monthly/yearly).
        //
        var $frequency = $('#plan-frequency');

        $frequency.on('click', '.switch-label', function(e) {
            var type = $(this).attr('data-plan-frequency'),
                $elements = $('.matrix-plan [data-plan-frequency]');

            $('.switch', $frequency).toggleClass('end', (type == 'monthly'));
            $('.switch-label', $frequency).removeClass('active');
            $(this).addClass('active');

            $elements.addClass('hide').filter(function(i) {
                return $(this).attr('data-plan-frequency') == type;
            }).removeClass('hide');
        });
    });


    return pub;
}(jQuery, this, this.document));

