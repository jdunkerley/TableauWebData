var jdunkerley = jdunkerley || {};

jdunkerley.tableau = (function() {

    'use strict';

    var _isConnected = false;
    var _liveTableau = typeof(tableauVersionBootstrap) !== 'undefined';

    var dataName = '';
    var data = {}
    var cols = [];
    var types = [];

    if (jdunkerley.utils) {

        jdunkerley.utils.auditMessage('Tableau', 'Module Called.');

    }

    function isConnected() {

        return _isConnected; /* jshint ignore:line */

    }

    function isLive() {

        return _liveTableau;

    }

    function submit(dataName, data, columns, types) {

        if (!jdunkerley.tableau.connected()) {

            return;

        }

        /* jshint ignore:start */
        tableau.connectionName = dataName || 'data';
        tableau.connectionData = JSON.stringify({
            data: data || {},
            cols: columns || [],
            types: types || []
        });
        jdunkerley.utils.auditMessage('Tableau', 'Submit Called: ' + tableau.connectionData);
        tableau.submit();
        /* jshint ignore:end */

    }

    function restoreFromConnectionData() {

        if (!jdunkerley.tableau.connected()) {

            return;

        }

        if (tableau.connectionData === '') {

            return;

        }

        /* jshint ignore:start */
        jdunkerley.utils.auditMessage('Tableau', 'Restore Called: ' + tableau.connectionData);

        try {

            dataName = tableau.connectionName;

            var dataObj = JSON.parse(tableau.connectionData);
            data = dataObj.data;
            cols = dataObj.cols;
            types = dataObj.types;

        } catch (e) {

            jdunkerley.utils.logMessage('Tableau', 'Restore Failed:' + tableau.connectionData);

        }
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

        jdunkerley.utils.auditMessage('Tableau', 'Header Names: ' + JSON.stringify(cols));
        jdunkerley.utils.auditMessage('Tableau', 'Header Types: ' + JSON.stringify(types));
        tableau.headersCallback(cols, types); /* jshint ignore:line */

    }

    function getTableData(lastRecordNumber) {

        jdunkerley.utils.auditMessage("Tableau", "GetDataCalled - " + lastRecordNumber + typeof (lastRecordNumber));

        if (lastRecordNumber != '-1') {

            jdunkerley.tableau.fetchData(lastRecordNumber, data, cols, types);
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
        live: isLive,
        submit: submit,
        dataCallback: dataCallback,
        fetchData: function(lastRecordNumber, data, cols, types) {

            jdunkerley.tableau.dataCallback([], -1);

        }
    };

})();
