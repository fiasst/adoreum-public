var ACCOUNT = (function($, window, document, undefined) {
    var pub = {};


    //
    // Validation.
    //
    var finalDeleteAccountConfirm = function() {
        // Final confirmation message.
        var $confirm = $('#field-confirm'),
            params = {
                "message": "[p]Confirm one last time that you want to cancel any subscriptions, delete you account, and erase your personal data. [strong]This cannot be undone.[/strong][/p]",
                "type": "warning",
                "options": {
                    "title": "One final check...",
                    "actions": [
                        {
                            "type": "button",
                            "text": "No, take me to safety",
                            "attributes": {
                                "class": "button-secondary link-dashboard trigger-lbox-close",
                                "href": "#"
                            }
                        },
                        {
                            "type": "button",
                            "text": "Yes, Delete my account",
                            "attributes": {
                                "class": "button-primary danger trigger-lbox-close",
                                "href": "#",
                                "id": "trigger-delete-account"
                            }
                        }
                    ]
                }
            };

        //
        // Validate confirm field.
        //
        if (!$confirm.val() || $confirm.val().toLowerCase() != "delete") {
            params.message = "[p]You must type [strong]\"DELETE\"[/strong] in the required field to confirm that you want to delete your account.[/p]";
            params.type = "info";
            params.options.title = "Field required";
            params.options.actions = [
                {
                    "type": "button",
                    "text": "OK",
                    "attributes": {
                        "class": "button-primary trigger-lbox-close",
                        "href": "#"
                    }
                }
            ];
        }
        // Show dialog.
        MAIN.openDialog(params);
    };


    //
    // Webhook.
    //
    var deleteAccountHandler = function($form) {
        MAIN.thinking(true, true);
                
        // Delete member's account webhook.
        var data = HELP.getFormValues($form);
        data.customer_id = USER.current.stripeCustomerId;

        HELP.sendAJAX({
            url: 'https://hook.eu2.make.com/8conh6a72b8tatgqgntwfc2fj4v22c1k',
            method: 'POST',
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
    };


    //
    // On DOM ready.
    //
    $(function() {
        //
        // Delete account form handler.
        //
        var $formDeleteAccount = $('#wf-form-Delete-Account-Form');

        $formDeleteAccount.on('submit', function(e) {
            e.preventDefault();
            finalDeleteAccountConfirm();

            $(document).on('click', '#trigger-delete-account', function() {
                deleteAccountHandler($formDeleteAccount);
            });
            // Don't submit the form.
            return false;
        });

    });


    return pub;
}(jQuery, this, this.document));

