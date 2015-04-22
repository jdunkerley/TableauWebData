var jdunkerley = jdunkerley || {};

jdunkerley.utils = (function() {

    'use strict';

    function logMessage(sender, message, level) {

        level = level || '';

        if (jdunkerley.utils.showLogMessages) {

            jdunkerley.utils.consoleLog(level + sender + ' - ' + message);

        }

    }

    function auditMessage(sender, message) {

        if (jdunkerley.utils.showAuditLog) {

            logMessage(sender, message, '[AUDIT]');

        }

    }

    function setupPage() {

        /* Disable Return Presses */
        $('.catchReturn').on('keydown', function(e) {

            if (e.keyCode === 13) {

                e.preventDefault();

            }

        });

    }

    function loopBackLog(msg) {

        console.log(msg);
        $.ajax({

                url: '/Home/Log?message=' + encodeURI(msg)

            });

    }

    return {
        consoleLog: function(msg) {

            console.log(msg);

        },
        loopBackLog: loopBackLog,
        showAuditLog: false,
        showLogMessages: true,
        auditMessage: auditMessage,
        logMessage: logMessage,
        setupPage: setupPage
    };

}());
