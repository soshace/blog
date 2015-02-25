'use strict';

/**
 * Класс Контроллра
 *
 * @class Controller
 */
define([
    'class',
    'config'
], function (Class) {
    return Class.extend({
        /**
         * Алиас страницы
         *
         * @field
         * @name Controller#pageAlias
         * @type {String}
         */
        pageAlias: Soshace.pageAlias,

        /**
         * Параметры запроса из роута
         *
         * @field
         * @name Controller#routeParams
         * @type {Array | null}
         */
        routeParams: null,

        /**
         * Метод вызывает при рендере на сервере
         *
         * Метод должен быть переопрделен в унаследованном классе
         *
         * @method
         * @name Controller#firstLoad
         * @returns {undefined}
         */
        firstLoad: function () {

        },

        /**
         * Метод вызывает при рендере на клиенте
         *
         * Метод должен быть переопрделен в унаследованном классе
         *
         * @method
         * @name Controller#firstLoad
         * @returns {undefined}
         */
        secondLoad: function () {

        },

        /**
         * Метод вызывавется роутером,
         * в него передаются параметры запроса
         *
         * @method
         * @name Controller#routeHandler
         * @returns {undefined}
         */
        routeHandler: function () {
            var app = Soshace.app,
                pageAlias = this.pageAlias;

            Soshace.pageAlias = pageAlias;

            if (typeof arguments !== 'undefined') {
                this.routeParams = arguments;
            }

            app.getView('.js-header').changeTab(pageAlias);
            app.getView('.js-system-messages').changePage(pageAlias);
            if (Soshace.firstLoad) {
                Soshace.firstLoad = false;
                this.firstLoad();
                return;
            }

            this.secondLoad();
        }
    });
});