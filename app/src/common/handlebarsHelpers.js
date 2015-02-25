'use strict';

var _ = require('underscore'),
    Helpers = require('./helpers');

/**
 * Конструктор хелперов для Handlebars
 *
 * @constructor
 * @name HandlebarsHelpers
 * @param {Object} request
 * @returns {Object}
 */
module.exports = function (request) {
    var HandlebarsHelpers = {
        /**
         * Метод возврвращает первод строки-параметра
         *
         * @method
         * @name HandlebarsHelpers.i18n
         * @return {String}
         */
        i18n: function () {
            //В случае each передается контекст объекта в цикле,
            //поэтому используется ссылка на HandlebarsHelpers
            var _this = HandlebarsHelpers,
                i18n = request.i18n,
                translate = i18n.__.apply(i18n, arguments);

            Array.prototype.shift.call(arguments);
            return _this._i18nSetParams(translate, arguments);
        },

        /**
         * Метод вставляет в строку переменные из списка опций
         * Заменяет {{param}}
         *
         * @private
         * @method
         * @name HandlebarsHelpers._i18nSetParams
         * @param {String} value строка перевода
         * @param {Array} optionsList список опций
         * @returns {String}
         */
        _i18nSetParams: function (value, optionsList) {
            var stringParams = value.match(/\{\{(.+?)\}\}/g);

            _.each(stringParams, function (param, index) {
                value = value.replace(param, optionsList[index]);
            });

            return value;
        },

        /**
         * Метод отображает дату в формате 'mm.dd.yyyy'
         *
         * @method
         * @name HandlebarsHelpers.formatDate
         * @param {String} notFormattedDate неотформатированная дата
         * @return {String}
         */
        formatDate: function (notFormattedDate) {
            var dateObject = new Date(notFormattedDate),
                date = dateObject.getDate(),
                month = dateObject.getMonth() + 1,
                year = dateObject.getFullYear();

            date = Helpers.zeroLeading(date);
            month = Helpers.zeroLeading(month);

            return [date, month, year].join('.');
        }
    };

    return HandlebarsHelpers;
};