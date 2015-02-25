'use strict';

/**
 * Модуль содержит различные виджеты
 *
 * @module Widgets
 */

define([
    'underscore',
    'zepto'
], function (_, $) {
    return {
        /**
         * TODO: переделать на плагин
         *
         * Форматирует блоки с классом .prettyprint
         * в переданном контексте
         *
         * @name Widgets.prettify
         * @param {jQuery} context элемент DOM
         * @param {string} codeLanguage
         * @returns {undefined}
         */
        prettify: function (context, codeLanguage) {
            var $prettyPrint = $('.prettyprint', context),
                formattedHtml;

            $prettyPrint.each(function () {
                var codeBlock = $(this);

                formattedHtml = prettyPrintOne(codeBlock.html(), codeLanguage, true);
                codeBlock.html(formattedHtml);
            });
        }
    };
});