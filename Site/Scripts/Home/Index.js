var jdunkerley = jdunkerley || {};

jdunkerley.indexPage = (function() {

    'use strict';

    function clearMatches() {

        $('#matches').text('');
        $('#matchList').html('');

    }

    function searchSuccess(quandlCode, data) {

        var ulHtml, liHtml, doc, i;

        if ($('#quandlCode').val() !== quandlCode) {

            return;

        }

        $('#matches').text('Matches = ' + data.total_count);

        ulHtml = '';
        for (i = 0; i < data.docs.length; i++) {

            doc = data.docs[i];
            liHtml = '';
            liHtml += '<li><strong>';
            liHtml += $('<div/>').text(doc.source_name).html();
            liHtml += '</strong> - ';
            liHtml += '<a class="matchLink" href="#" data-link="';
            liHtml += encodeURI(doc.source_code) + '/' + encodeURI(doc.code);
            liHtml += '">';
            liHtml += $('<div/>').text(doc.name).html();
            liHtml += '</a></li>';
            ulHtml += liHtml;

        }

        $('#matchList').html(ulHtml);

    }

    function dataSuccess(quandlCode, data) {

        var content, i;

        if ($('#quandlCode').val() !== quandlCode) {

            return;

        }

        content = 'Data Count: ' + data.data.length;
        for (i = 0; i < data.data.length; i++) {

            content += '\n' + JSON.stringify(data.data[i]);

        }

        $('#data').text(content);

    }

    function metaSuccess(quandlCode, data) {

        var ulHtml, liHtml, i, j, type, ctype, typeList;

        if ($('#quandlCode').val() !== quandlCode) {

            return;

        }

        $('#matches').text(data.name + ' = ' + data.column_names.length + ' columns.');

        typeList = [];

        ulHtml = '';
        for (i = 0; i < data.column_names.length; i++) {

            liHtml = '';
            liHtml += '<li><strong>';
            liHtml += data.column_names[i];

            type = '';
            for (j = 0; j < data.data.length; j++) {

                ctype = typeof (data.data[j][i]);
                if (ctype === 'string') {

                    ctype = /^([0-9]{4}-[0-9]{2}-[0-9]{2})$/.test(data.data[j][i]) ? 'date' : 'string';

                } else if (ctype === 'number') {

                    ctype = 'float';

                }

                if (ctype === type || type === '') {

                    type = ctype;

                } else {

                    type = 'string';

                }

            }

            typeList[i] = type;

            liHtml += ' - ';
            liHtml += type;

            liHtml += '</li>';
            ulHtml += liHtml;

        }

        $('#matchList').html(ulHtml);

        if (jdunkerley.tableau && jdunkerley.tableau.connected()) {

            jdunkerley.tableau.data = {
                code: quandlCode,
                authKey: jdunkerley.quandl.getAuthKey()
            };
            jdunkerley.tableau.dataName = data.name;
            jdunkerley.tableau.columns = data.column_names;
            jdunkerley.tableau.types = typeList;

            $('#submitRow').toggleClass('hidden', false);

        }

        $('#data').text('Fetching Data...');
        jdunkerley.quandl.getData(quandlCode, dataSuccess, function(quandlCode) {

            if ($('#quandlCode').val() !== quandlCode) {

                return;

            }

            $('#data').text('Fetching Data Failed.');

        });

    }

    function metaFailed(quandlCode, xhr) {

        if ($('#quandlCode').val() !== quandlCode) {

            return;

        }

        if (xhr.status === 404) {

            jdunkerley.quandl.runSearch(quandlCode, searchSuccess);

        }

    }

    function handleData(quandlCode, data) {

        var cols, result, row, i, j;
        jdunkerley.utils.logMessage('index', 'data back');

        cols = jdunkerley.tableau.columns;

        result = [];
        for (i = 0; i < data.data.length; i++) {

            row = {};
            for (j = 0; j < cols.length; j++) {

                row[cols[j]] = data.data[i][j];

            }

            result[i] = row;

        }

        jdunkerley.tableau.dataCallback(result, -1);

    }

    function startSearch() {

        jdunkerley.indexPage.clearMatches();

        var currentVal = $('#quandlCode').val();
        if (currentVal.indexOf('/') === -1) {

            jdunkerley.quandl.runSearch(currentVal, jdunkerley.indexPage.searchSuccess);

        } else {

            jdunkerley.quandl.getMetaData(
                currentVal,
                jdunkerley.indexPage.metaSuccess,
                jdunkerley.indexPage.metaFailed);

        }

    }

    return {
        clearMatches: clearMatches,
        metaSuccess: metaSuccess,
        metaFailed: metaFailed,
        searchSuccess: searchSuccess,
        startSearch: startSearch,
        handleData: handleData
    };

}());

$(document).ready(function() {

    'use strict';

    jdunkerley.utils.auditMessage('UserAgent', navigator.userAgent);

    /* Link on screen message box */
    var currentLogger = jdunkerley.utils.consoleLog;
    jdunkerley.utils.consoleLog = function(msg) {

        if (jdunkerley.tableau && jdunkerley.tableau.connected) {

            tableau.log(msg);

        }

        $('#message').text(msg);
        currentLogger(msg);

    };

    jdunkerley.utils.setupPage();

    /* Wire Up Auth Key */
    if ($('#quandlAPIKey').val() === '') {

        var currentKey = jdunkerley.quandl.getAuthKey();
        if (currentKey) {

            $('#quandlAPIKey').val(currentKey);

        }
        $('#quandlAPIKey').on('input paste', function() {

            jdunkerley.quandl.setAuthKey($('#quandlAPIKey').val());

        });

    }

    /* Wire Up Search Box */
    $('#quandlCode').on('input paste', jdunkerley.indexPage.startSearch);

    /* Wire Up Matches */
    $('#matchList').on('click', 'a.matchLink', function(e) {

        var currentVal = e.target.getAttribute('data-link');
        $('#quandlCode').val(currentVal);
        jdunkerley.quandl.getMetaData(currentVal, jdunkerley.indexPage.metaSuccess);

    });

    /* Tableau Mode */
    if (jdunkerley.tableau) {

        jdunkerley.utils.auditMessage('Ready', 'Tableau Mode');

        /* Wire Up Submit */
        $('#submit').on('click', function(e) {

            e.preventDefault();
            jdunkerley.tableau.submit();

        });

        /* Wire Up Data Callback */
        jdunkerley.tableau.dataCallback = function() {

            jdunkerley.quandl.setAuthKey(jdunkerley.tableau.data.authKey);
            jdunkerley.quandl.getData(jdunkerley.tableau.data.code, jdunkerley.indexPage.handleData);

        };

    }

    if ($('#quandlCode').val() !== '') {

        jdunkerley.indexPage.startSearch();

    }

});
