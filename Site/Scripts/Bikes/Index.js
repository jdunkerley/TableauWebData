$(document).ready(function() {

    'use strict';

    jdunkerley.utils.setupPage();

    /* Wire Up Submit */
    $('#submit').on('click', function (e) {

        e.preventDefault();

        if (jdunkerley.tableau) {

            jdunkerley.tableau.submit(
                'TfL Bike Data',
                {},
                ['id', 'commonName', 'terminalName', 'latitude', 'longitude', 'installed', 'locked', 'installDate', 'removalDate', 'temporary', 'bikes', 'spaces', 'docks', 'modified'],
                ['int', 'string', 'int', 'float', 'float', 'bool', 'bool', 'datetime', 'datetime', 'bool', 'int', 'int', 'int', 'datetime']);

        }

    });

    /* Wire Up Data Callback */
    if (jdunkerley.tableau) {

        jdunkerley.tableau.fetchData = jdunkerley.bikesTfl.getData;

    }

});
