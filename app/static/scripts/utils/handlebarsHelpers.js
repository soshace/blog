'use strict';

/**
 * Вспомогательные методы для шаблонизатора
 * Handlebars
 *
 * @module HandlebarsHelpers
 */

define([
    'underscore',
    'handlebars',
    'utils/helpers'
], function (_, Handlebars, Helpers) {
    /**
     * Метод перевода
     */
    Handlebars.registerHelper('i18n', _.bind(Helpers.i18n, Helpers));

    /**
     * Метод отображает дату в формате 'mm.dd.yyyy'
     */
    Handlebars.registerHelper('formatDate', function (notFormattedDate) {
        var dateObject = new Date(notFormattedDate),
            date = dateObject.getDate(),
            month = dateObject.getMonth() + 1,
            year = dateObject.getFullYear();

        date = Helpers.zeroLeading(date);
        month = Helpers.zeroLeading(month);

        return [date, month, year].join('.');
    });
});