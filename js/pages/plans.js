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


        //
        // Agree to plan terms in order to subscribe.
        //
        $('.terms-agree').each(function() {
            $(this)
                .on('change', 'input[type="checkbox"]', function(e) {
                    $('.button-cover', $(e.target).parents('.terms-agree')).toggle(!$(e.target).is(':checked'));
                })
                .on('click', '.button-cover', function(e) {
                    if (!$(this).find('checkbox').is(':checked')) {
                        alert('Please read the agreement in full and confirm that you agree by checking the box at the bottom.')
                    }
                });
        });
        $('.terms-agree .button-cover').css('cursor', 'pointer');
    });


    return pub;
}(jQuery, this, this.document));

