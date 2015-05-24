var jdunkerley = jdunkerley || {};

jdunkerley.tableau = (function() {

    'use strict';

    if (jdunkerley.utils) {

        jdunkerley.utils.auditMessage('Tableau', 'Module Called.');

    }

    function isConnected() {

        return tableau !== undefined; /* jshint ignore:line */

    }

    function submit() {

        if (!jdunkerley.tableau.connected()) {

            return;

        }

        /* jshint ignore:start */
        tableau.connectionName = jdunkerley.tableau.dataName;
        tableau.connectionData = JSON.stringify({
            data: jdunkerley.tableau.data,
            cols: jdunkerley.tableau.columns,
            types: jdunkerley.tableau.types
        });
        jdunkerley.utils.auditMessage('Tableau', 'Submit Called: ' + tableau.connectionData);
        tableau.submit();
        /* jshint ignore:end */

    }

    function restoreFromConnectionData() {

        /* jshint ignore:start */
        jdunkerley.utils.auditMessage('Tableau', 'Restore Called: ' + tableau.connectionData);
        var dataObj = JSON.parse(tableau.connectionData);
        jdunkerley.tableau.connectionName = tableau.connectionName;
        jdunkerley.tableau.data = dataObj.data;
        jdunkerley.tableau.columns = dataObj.cols;
        jdunkerley.tableau.types = dataObj.types;
        /* jshint ignore:end */

    }

    function init() {

        if (!jdunkerley.tableau.connected()) {

            return;

        }

        jdunkerley.utils.auditMessage('Tableau', 'Init Called.');
        restoreFromConnectionData();
        tableau.initCallback(); /* jshint ignore:line */

    }

    function getColumnHeaders() {

        if (!jdunkerley.tableau.connected()) {

            return;

        }

        jdunkerley.utils.auditMessage('Tableau', 'Header Names: ' + JSON.stringify(jdunkerley.tableau.columns));
        jdunkerley.utils.auditMessage('Tableau', 'Header Types: ' + JSON.stringify(jdunkerley.tableau.types));
        tableau.headersCallback(jdunkerley.tableau.columns, jdunkerley.tableau.types); /* jshint ignore:line */

    }

    function dataCallback(dataArray, index) {

        tableau.dataCallback(dataArray, index); /* jshint ignore:line */

    }

    function shutdown() {

        if (!jdunkerley.tableau.connected()) {

            return;

        }

        jdunkerley.utils.auditMessage('Tableau', 'Shutdown Called.');
        tableau.shutdownCallback(); /* jshint ignore:line */

    }

    return {
        connected: isConnected,
        init: init,
        submit: submit,
        getColumnHeaders: getColumnHeaders,
        dataCallback: dataCallback,
        shutdown: shutdown,
        data: {},
        dataName: '',
        columns: [],
        types: [],
        fetchData: function(lastRecordNumber) {

            jdunkerley.tableau.dataCallback([], -1);

        }
    };

})();

/* jshint -W098 */
function init() {

    jdunkerley.tableau.init();

}

function shutdown() {

    jdunkerley.tableau.shutdown();

}

function getColumnHeaders() {

    jdunkerley.tableau.getColumnHeaders();

}

function getTableData(lastRecordNumber) {

    jdunkerley.utils.auditMessage("Tableau", "GetDataCalled - " + lastRecordNumber + typeof (lastRecordNumber));

    if (lastRecordNumber != '-1') {

        jdunkerley.tableau.fetchData(lastRecordNumber);
        return;

    }

    jdunkerley.tableau.dataCallback([], lastRecordNumber);
}

/* jshint +W098 */
