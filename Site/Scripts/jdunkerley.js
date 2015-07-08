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

        /* Link on screen message box */
        var currentLogger = jdunkerley.utils.consoleLog;
        jdunkerley.utils.consoleLog = function (msg) {

            if (jdunkerley.tableau.connected) {

                tableau.log(msg);

            }

            $('#message').text(msg);
            currentLogger(msg);

        };

        /* Disable Return Presses */
        $('.catchReturn').on('keydown', function(e) {

            if (e.keyCode === 13) {

                e.preventDefault();

            }

        });

        jdunkerley.utils.auditMessage('UserAgent', navigator.userAgent);
        jdunkerley.utils.logMessage('Init', 'Page Ready: ' + (jdunkerley.tableau && jdunkerley.tableau.live() ? "Connected" : "Not Connected"));

    }

    function loopBackLog(msg) {

        console.log(msg);
        $.ajax({

                url: '/Log?message=' + encodeURI(msg)

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
