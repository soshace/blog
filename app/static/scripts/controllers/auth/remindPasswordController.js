'use strict';

/**
 * Контроллер страницы восстановления пароля
 *
 * @class RemindPasswordController
 */
define([
        'backbone',
        'utils/controller',
        'models/auth/remindPasswordModel',
        'views/auth/remindPasswordView',
        'utils/helpers',
        'config'
    ],
    function (Backbone, Controller, RemindPasswordModel, RemindPasswordView, Helpers) {
        return Controller.extend({
            /**
             * Алиас страницы
             *
             * @field
             * @name RemindPasswordController#pageAlias
             * @type {String}
             */
            pageAlias: 'remind_password',

            /**
             * @field
             * @name RemindPasswordController#model
             * @type {RemindPasswordModel | null}
             */
            model: null,

            /**
             * @field
             * @name RemindPasswordController#view
             * @type {RemindPasswordView | null}
             */
            view: null,

            /**
             * @constructor
             * @name RemindPasswordController#initialize
             * @returns {undefined}
             */
            initialize: function () {
                this.model = new RemindPasswordModel();
                this.view = new RemindPasswordView({
                    model: this.model
                });
            },


            /**
             * Метод вызывает при рендере на сервере
             *
             * @method
             * @name RemindPasswordController#firstLoad
             * @returns {undefined}
             */
            firstLoad: function () {
                var app = Soshace.app,
                    view = this.view;

                view.$el = app.elements.contentFirstLoad;
                view.delegateEvents();
                view.afterRender();
            },

            /**
             * Метод вызывает при рендере на клиенте
             *
             * @method
             * @name RemindPasswordController#firstLoad
             * @returns {undefined}
             */
            secondLoad: function () {
                var locale,
                    userName,
                    view = this.view,
                    app = Soshace.app;

                if (app.isAuthenticated()) {
                    locale = Helpers.getLocale();
                    userName = Soshace.profile.userName;
                    Backbone.history.navigate('/' + locale + '/users/' + userName);
                }

                this.view = view;
                app.setView('.js-content', view).render();
            }
        });
    });