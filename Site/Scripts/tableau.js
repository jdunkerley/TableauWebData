var jdunkerley = jdunkerley || {};

jdunkerley.tableau = (function() {

    'use strict';

    var _isConnected = false;

    if (jdunkerley.utils) {

        jdunkerley.utils.auditMessage('Tableau', 'Module Called.');

    }

    function isConnected() {

        return _isConnected; /* jshint ignore:line */

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

        _isConnected = true;
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

    function getTableData(lastRecordNumber) {

        jdunkerley.utils.auditMessage("Tableau", "GetDataCalled - " + lastRecordNumber + typeof (lastRecordNumber));

        if (lastRecordNumber != '-1') {

            jdunkerley.tableau.fetchData(lastRecordNumber);
            return;

        }

        jdunkerley.tableau.dataCallback([], lastRecordNumber);
    }

    function shutdown() {

        _isConnected = false;
        jdunkerley.utils.auditMessage('Tableau', 'Shutdown Called.');
        tableau.shutdownCallback(); /* jshint ignore:line */

    }

    function dataCallback(dataArray, index) {

        tableau.dataCallback(dataArray, index.toString(), index === -1); /* jshint ignore:line */

    }

    function createConnector() {

        var connector = tableau.makeConnector();
        connector.init = init;
        connector.getColumnHeaders = getColumnHeaders;
        connector.getTableData = getTableData;
        connector.shutdown = shutdown;
        tableau.registerConnector(connector);

    }

    if (tableau) {

        createConnector();

    }


    return {
        connected: isConnected,
        submit: submit,
        dataCallback: dataCallback,
        data: {},
        dataName: '',
        columns: [],
        types: [],
        fetchData: function(lastRecordNumber) {

            jdunkerley.tableau.dataCallback([], -1);

        }
    };

})();
