'use strict';

/**
 * Контроллер страницы 404
 *
 * @class NotFoundController
 */
define([
        'underscore',
        'utils/controller',
        'views/notFoundView'
    ],
    function (_, Controller, NotFoundView) {
        return Controller.extend({
            /**
             * Алиас страницы
             *
             * @field
             * @name NotFoundController#pageAlias
             * @type {String}
             */
            pageAlias: '404',

            /**
             * @field
             * @name NotFoundController#view
             * @type {NotFoundView | null}
             */
            view: null,

            /**
             * @constructor
             * @name NotFoundController#initialize
             * @returns {undefined}
             */
            initialize: function () {
                this.view = new NotFoundView();
            },

            /**
             * Метод вызывает при рендере на клиенте
             *
             * @method
             * @name RegistrationController#firstLoad
             * @returns {undefined}
             */
            secondLoad: function () {
                var view = this.view,
                    app = Soshace.app;

                this.view = view;
                app.setView('.js-content', view).render();
            }
        });
    });