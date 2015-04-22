var jdunkerley = jdunkerley || {};

jdunkerley.tableau = (function() {

    'use strict';

    if (jdunkerley.utils) {

        jdunkerley.utils.auditMessage('Tableau', 'Module Called.');

    }

    function isConnected() {

        return tableau !== undefined;

    }

    function submit() {

        if (!isConnected()) {

            return;

        }

        tableau.connectionName = jdunkerley.tableau.dataName;
        tableau.connectionData = JSON.stringify({
            data: jdunkerley.tableau.data,
            cols: jdunkerley.tableau.columns,
            types: jdunkerley.tableau.types
        });
        jdunkerley.utils.auditMessage('Tableau', 'Submit Called: ' + tableau.connectionData);
        tableau.submit();

    }

    function restoreFromConnectionData() {

        jdunkerley.utils.auditMessage('Tableau', 'Restore Called: ' + tableau.connectionData );
        var dataObj = JSON.parse(tableau.connectionData);
        jdunkerley.tableau.connectionName = tableau.connectionName;
        jdunkerley.tableau.data = dataObj.data;
        jdunkerley.tableau.columns = dataObj.cols;
        jdunkerley.tableau.types = dataObj.types;

    }

    function init() {

        if (!isConnected()) {

            return;

        }

        jdunkerley.utils.auditMessage('Tableau', 'Init Called.');
        restoreFromConnectionData();
        tableau.initCallback();
    }

    function getColumnHeaders() {

        jdunkerley.utils.auditMessage('Tableau', 'Headers Called: ' + JSON.stringify(jdunkerley.tableau.columns));
        jdunkerley.utils.auditMessage('Tableau', 'Headers Called: ' + JSON.stringify(jdunkerley.tableau.types));
        tableau.headersCallback(jdunkerley.tableau.columns, jdunkerley.tableau.types);

    }

    function shutdown() {

        if (!isConnected()) {

            return;

        }

        jdunkerley.utils.auditMessage('Tableau', 'Shutdown Called.');
        tableau.shutdownCallback();
    }

    return {
        connected: isConnected(),
        submit: submit,
        init: init,
        shutdown: shutdown,
        getColumnHeaders: getColumnHeaders,
        data: {},
        dataName: '',
        columns: [],
        types: []
    };

})();

function init() {

    jdunkerley.tableau.init();

}

function shutdown() {

    jdunkerley.tableau.shutdown();

}

function getColumnHeaders() {

    jdunkerley.tableau.getColumnHeaders();

}
