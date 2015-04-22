var jdunkerley = jdunkerley || {};

jdunkerley.quandl = (function() {

    'use strict';
    var authKey = '';

    if (jdunkerley.utils) {

        jdunkerley.utils.auditMessage('quandl', 'Module Called.');

    }

    function getAuthKey() {

        if (window.localStorage) {

            return window.localStorage.getItem('quandlAuthKey');

        }

        return authKey;
    }

    function setAuthKey(newKey) {

        if (window.localStorage) {

            window.localStorage.setItem('quandlAuthKey', newKey);

        }

        authKey = newKey;
        jdunkerley.utils.logMessage('quandl', 'Auth Key Saved.');

    }

    function getMetaData(quandlCode, successCallback, failCallback) {

        var searchUrl, authKey;

        searchUrl = 'https://www.quandl.com/api/v1/datasets/' + encodeURI(quandlCode) + '.json?rows=10';

        authKey = getAuthKey();
        if (authKey.trim() !== '') {

            searchUrl += '&auth_token=' + authKey;

        }

        jdunkerley.utils.auditMessage('quandl', 'Meta Data URL - ' + searchUrl);
        $.ajax({

            url: searchUrl

        }).done(function(data) {

            jdunkerley.utils.auditMessage('quandl', 'Meta Data Fetched.');
            successCallback(quandlCode, data);

        }).error(function(xhr) {

            jdunkerley.utils.logMessage(
                'quandl',
                'Error On MetaData: ' + xhr.status + ' - ' + xhr.statusText + '\n' + xhr.responseText);
            if (failCallback) {

                failCallback(quandlCode, xhr);

            }

        });

    }

    function getData(quandlCode, successCallback, failCallback) {

        var searchUrl = 'https://www.quandl.com/api/v1/datasets/' + encodeURI(quandlCode);
        searchUrl += '.json';

        var authKey = getAuthKey();
        if (authKey.trim() !== '') {

            searchUrl += '?auth_token=' + authKey;

        }

        jdunkerley.utils.auditMessage('quandl', 'Data URL - ' + searchUrl);
        $.ajax({

            url: searchUrl

        }).done(function(data) {

            jdunkerley.utils.auditMessage('quandl', 'Data Fetched.');
            successCallback(quandlCode, data);

        }).error(function(xhr) {

            jdunkerley.utils.logMessage(
                'quandl',
                'Error On Data: ' + xhr.status + ' - ' + xhr.statusText + '\r\n' + xhr.responseText);
            if (failCallback === undefined) {

                failCallback(quandlCode, xhr);

            }

        });

    }

    function runSearch(quandlCode, successCallback, failCallback) {

        if (quandlCode.length < 3) {

            return;

        }

        var searchUrl = 'https://www.quandl.com/api/v1/datasets.json?query=' + encodeURI(quandlCode);
        searchUrl += '&per_page=100';

        var authKey = $('#quandlAPIKey').val();
        if (authKey.trim() !== '') {

            searchUrl += '&auth_token=' + authKey;

        }

        jdunkerley.utils.auditMessage('quandl', 'Search URL - ' + searchUrl);
        $.ajax({

            url: searchUrl

        }).done(function(data) {

            jdunkerley.utils.auditMessage('quandl', 'Search Data Fetched.');
            successCallback(quandlCode, data);

        }).error(function(xhr) {

            jdunkerley.utils.logMessage(
                'quandl',
                'Error On Search: ' + xhr.status + ' - ' + xhr.statusText + '\r\n' + xhr.responseText);
            if (failCallback === undefined) {

                failCallback(quandlCode, xhr);

            }

        });

    }

    return {
        getAuthKey: getAuthKey,
        setAuthKey: setAuthKey,
        getMetaData: getMetaData,
        getData: getData,
        runSearch: runSearch
    };

}());
