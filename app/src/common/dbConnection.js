'use strict';

var Mongoose = require('mongoose');

module.exports = {
    /**
     * Запускаем базу
     *
     * @public
     * @function
     * @name DbConnection.databaseOpen
     * @param {Function} callback
     * @return {undefined}
     */
    databaseOpen: function (callback) {
        Mongoose.connect(Soshace.DB_HOST);
        var database = Mongoose.connection;
        database.on('error', console.error.bind(console, 'connection error:'));
        database.once('open', function () {
            console.log('Database was opened successfully');
            callback();
        });
    }
};
