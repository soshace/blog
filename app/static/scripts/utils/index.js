'use strict';

/**
 * TODO: доделать!!!
 *
 * Модуль будет содержать все сторонние зависимости
 *
 * @module Utils
 */
define([
    './helpers',
    './widgets',
    './controller'
], function (Helpers, Widgets, Controller) {
    return {
        Helpers: Helpers,
        Widgets: Widgets,
        Controller: Controller
    };
});