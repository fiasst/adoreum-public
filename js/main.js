var MAIN = (function($, window, document, undefined) {
    var pub = {};


    //
    // Memberstack plan names.
    //
    pub.planNames = {
        "pln_international-04fg0amm": "International",
        "pln_individual-1o2k0g6o": "Individual",
        "pln_corporate-xs2l0g4l": "Corporate"
    };


    //
    // Show or remove content based on conditions.
    //
    pub.controlHTML = function($elements, display) {
        $elements.each(function() {
            var $el = $(this);
            
            // Show.
            if (display) {
                if ($el.hasClass('hide')) {
                    $el.removeClass('hide');
                }
                else {
                    $el.show();
                }
            }
            // Remove.
            else {
                $el.remove();
            }
        });
    };


    //
    //
    //
    pub.memberCanModerate = function(member) {
        return HELP.hasPermissions('can:moderate', member);
    };


    //
    // Check whether the member has credentials to edit a node (page).
    //
    pub.memberCanEdit = function(member, $node) {
        var authorID = HELP.sanitizeHTML($node.find('.node-author').attr('data-author'));
        
        if (HELP.checkKeyExists(member, 'id')) {
            // Is author OR has Moderator permissions.
            return (member.id == authorID || pub.memberCanModerate(member));
        }
        // Member not loaded. Maybe Anon.
        return false;
    };


    //
    //
    //
    pub.handleAjaxResponse = function(data, form) {
        pub.dialog(data);
        
        if (HELP.checkKeyExists(data, 'callback')) {
            HELP.callNestedFunction(data.callback, data, form);
        }
        if (form && HELP.checkKeyExists(data, "enableForm") && !!data.enableForm) {
            // Revert button back to default, enabled button.
            pub.buttonThinking(form.find('.form-submit'), true);
        }
    };


    //
    // Display information and optional action buttons in various dialog UI options.
    //
    pub.dialog = function(data) {
        if (HELP.checkKeyExists(data, "mode")) {
            switch (data.mode) {
                case 'alert':
                    // Need to sanitize this...
                    // alert(HELP.sanitizeHTML(data.message));
                    break;

                case 'banner':
                    // Nothing to see yet.
                    break;

                default:
                    pub.openDialog(data);
            }
        }
    };


    //
    //
    //
    pub.openDialog = (params) => {
        var actions;
        if (HELP.checkKeyExists(params, "options.actions")) {
            actions = $('<div class="actions justify-center" />');

            $.each(params.options.actions, function(i, item) {
                item.attributes.class = item.attributes.class || '';
                if (item.type == 'button') {
                    item.attributes.class += ' w-button small';
                }
                actions.append(
                    $('<a>', {
                        text: item.text,
                        attr: HELP.sanitizeAttrs(item.attributes)
                    })
                );
            })
        }
        var defaults = {
            bodyClasses: 'lbox-dialog',
            html: [HELP.tokenHTML(params.message), actions],
            css: {
                xxs: {
                    offset: 20,
                    maxWidth: 650,
                    contentInnerPadding: 20
                }
            }
        };

        HELP.waitFor(window.jQuery, 'litbox', 100, function() {
            // Litbox.
            $.litbox( $.extend(true, {}, defaults, params.options) );
        });

        $(document)
            .one('click', '.trigger-lbox-close', function(e) {
                if ($(this).attr('href') == '#') {
                    e.preventDefault();
                }
                $.litbox.close();
            })
            // Don't combine the close and reload classes or reload won't work.
            .one('click', '.trigger-reload', function(e) {
                e.preventDefault();
                
                if ($('body').hasClass('litbox-show')) {
                    $.litbox.close();
                }
                pub.thinking(true);
                
                // Reload the URL without including the hash.
                    // The Hash prevents the page reloading.
                    // And it'll launch a Litbox on page load if it finds an ID matching the hash.
                window.location = window.location.href.split('#')[0];
            });
    };


    //
    //
    //
    pub.thinking = (show, overlay = false) => {
        let classes = show ? (overlay ? 'thinking-overlay' : 'thinking') : 'thinking-overlay thinking';
        $('body').toggleClass(classes, show);
    };


    //
    //
    //
    pub.buttonThinking = function(btn, revert) {
        if (btn.length < 1) return false;

        if (!revert) {
            // Disable the button.
            btn.attr('disabled', true).addClass('thinking');
            if (btn.get(0).nodeName == 'BUTTON') {
                btn.attr('data-value', btn.text()).text(btn.attr('data-wait'));
            }
            else {
                btn.attr('data-value', btn.attr('value')).attr('value', btn.attr('data-wait'));
            }
        }
        else {
            // Revert the button back to initial state.
            btn.removeAttr('disabled').removeClass('thinking clicked');
            if (btn.get(0).nodeName == 'BUTTON') {
                btn.text(btn.attr('data-value'));
            }
            else {
                btn.attr('value', btn.attr('data-value'));
            }
        }
    };


    //
    // Alternative for displaying Metadata values via HTML data-attributes.
    //
    pub.replaceTextWithMetadata = function(metadata) {
        $('[data-ms-member-meta]').each(function() {
            var data = HELP.sanitizeHTML($(this).attr('data-ms-member-meta'));

            if (HELP.checkKeyExists(metadata, data)) {
                $(this).text(metadata[data]);
            }
        });
    };


    //
    // Stop body from being scrollable.
    //
    pub.bodyPreventScroll = function(scroll, bodyClass) {
        $('body').toggleClass(bodyClass || 'no-scroll', scroll);
    };


    //
    //
    //
    pub.openLitbox = (params) => {
        var defaults = {
                title: false,
                // href: '#',
                inline: true,
                returnFocus: false,
                trapFocus: false,
                overlayClose: false,
                escKey: false,
                css: {
                    xxs: {
                        offset: 20,
                        maxWidth: 900,
                        width: '100%',
                        opacity: 0.4
                    },
                    sm: {
                        offset: '5% 20px'
                    }
                }
            };

        HELP.waitFor(window.jQuery, 'litbox', 100, function() {
            // Litbox.
            $.litbox( $.extend(true, {}, defaults, params) );
        });
    };


    //
    // On DOM ready.
    //
    $(function() {
        //
        // Get current Member.
        //
        USER.getCurrentMember(function(member) {
            //if (!!member.verified) {
                //member has verified email.
            //}

            
            //
            //
            //
            if (HELP.checkKeyExists(member, 'metaData')) {
                pub.replaceTextWithMetadata(member.metaData);
            }


            //
            // Show content if User has permissions.
            //
            $('[data-ms-perm]').each(function() {
                pub.controlHTML($(this), HELP.hasPermissions($(this).attr('data-ms-perm'), member));
            });
        });


        //
        // Cookie consent banner.
        //
        var $consentBanner = $('#cookie-consent');
        // Function to remove non-functional cookies (example, you may need to adjust based on actual cookie names)
        function removeNonFunctionalCookies() {
            // List of non-functional cookies to remove, if any exist
            var cookies = [];//['analytics_cookie', 'marketing_cookie'];
            cookies.forEach(function(cookieName) {
                HELP.deleteCookie(cookieName);
            });
        }
        // Check if the consent cookie exists
        if (!HELP.getCookie('adoreum_consent')) {
            // Cookie not found, show the consent element
            $consentBanner.removeClass('hide');
        }
        // Handle Accept button click
        $consentBanner.on('click', '.consent-accept', function(e) {
            e.preventDefault();
            // Set the consent cookie to 'true'
            HELP.setCookie('adoreum_consent', 'true', 365);
            // Hide the consent element
            $consentBanner.remove();
        });
        // Handle Decline button click
        $consentBanner.on('click', '.consent-decline', function(e) {
            e.preventDefault();
            // Set the consent cookie to 'false' to indicate refusal
            HELP.setCookie('adoreum_consent', 'false', 365);
            // Remove non-functional cookies
            removeNonFunctionalCookies();
            // Hide the consent element
            $consentBanner.remove();
        });


        //
        // Dropdown menus.
        //
        $(document).on('click.dropdowns', function(e) {
            var $dropdown = $('.dropdown'),
                updateDropdownLabel = (dd) => {
                    $('.label', dd).text(`${dd.data('label')} (${dd.find('input:checked').length})`);
                };

            // Set the dropdown label value for later reference
            if (!$dropdown.data('label')) {
                $dropdown.data('label', $('.label', $dropdown).text());
            }

            // Check if the clicked element is the .label inside the .dropdown
            if ($(e.target).closest('.dropdown .label').length) {
                var ul = $(e.target).siblings('ul:first');// Get the first sibling <ul>
                ul.toggle();// Toggle the visibility of the <ul>
            }
            else if (!$(e.target).closest('.dropdown').length) {
                // If clicked outside of .dropdown, hide the <ul>
                $dropdown.find('ul').hide();
            }

            // Listen for checkbox changes inside dropdowns
            $('.dropdown [type="checkbox"]').on('change', function() {
                // Update the label when a checkbox is checked/unchecked
                updateDropdownLabel( $(this).closest('.dropdown') );
            });

            // Initialize the label on page load for each dropdown
            $('.dropdown').each(function() {
                updateDropdownLabel($(this));
            });
        });



        //
        // General Litbox trigger handler.
        //
        $(document).on('click', '.trigger-lbox', function(e) {
            e.preventDefault();

            // Open Litbox.
            pub.openLitbox({
                title: $(this).attr('data-title'),
                href: $(this).attr('href')
            });
        });


        //
        // Accordions.
        //
        $(document).on('click', '.accordion-header', function() {
            $(this).parent().toggleClass('active').find('.accordion-content').toggleClass('active');
        });


        //
        // Launch "Confirm" alert dialogs on element click.
        //
        $('.alert-confirm').on('click.alertConfirm', function(e) {
            var msg = HELP.sanitizeHTML($(this).attr('data-confirm'));
            if (msg) {
                e.preventDefault();
              
                if (confirm(msg)) {
                    $(this).off('click.alertConfirm').trigger('click');
                }
                else {
                    // Remove a class that's added in another listener.
                    $(this).removeClass('clicked');
                    return false;
                }
            }
        });


        //
        // Toggle element visibility.
        //
        $(document).on('click', '.toggle-vis', function(e) {
            var target = HELP.sanitizeHTML($(this).attr('href'));

            if (!!target.length) {
                e.preventDefault();
                $(this).toggleClass('active');
                $(target).toggleClass($(this).attr('data-toggle-class') || 'hide');
            }
        });


        //
        // Trigger for newly introduced Dashboard links on the page (LitBox) to
        // imitate Memberstack.js functionality.
        //
        $(document).on('click', '.link-dashboard', function(e) {
            e.preventDefault();
            if (HELP.checkKeyExists(USER, "current")) {
                var redir =  USER.current.loginRedirect;

                if (!!redir && redir != '/') {
                    window.location.href = redir;
                }
                else {
                    // If loginRedirect isn't set, the user has probably just joined and
                    // Make hasn't finished updating the MS object before the page loaded.
                    // User the ID portion of the Member ID, since we use that for a Slug.
                    var id = USER.current.id.split('_').slice(-1);
                    if (!!id) {
                        window.location.href = '/dashboard/'+ id;
                    }
                }
            }
        });

    });

    return pub;
}(jQuery, this, this.document));





