'use strict';

/**
 * Контроллер страницы настроек пользователя
 *
 * @class UsersSettingsController
 */
define([
        'underscore',
        'utils/controller',
        'models/usersModel',
        'views/users/usersSettingsView'
    ],
    function (_, Controller, UsersModel, UsersSettingsView) {
        return Controller.extend({
            /**
             * Алиас страницы
             *
             * @field
             * @name UsersSettingsController#pageAlias
             * @type {String}
             */
            pageAlias: 'userSettings',

            /**
             * @field
             * @name UsersSettingsController#model
             * @type {UsersModel | null}
             */
            model: null,

            /**
             * @field
             * @name UsersSettingsController#view
             * @type {UsersSettingsView | null}
             */
            view: null,

            /**
             * @constructor
             * @name UsersSettingsController#initialize
             * @returns {undefined}
             */
            initialize: function () {
                var model,
                    view;

                model = new UsersModel();
                view = new UsersSettingsView({
                    model: model
                });

                this.model = model;
                this.view = view;
            },


            /**
             * Метод вызывает при рендере на сервере
             *
             * @method
             * @name UsersSettingsController#firstLoad
             * @returns {undefined}
             */
            firstLoad: function () {
                var app = Soshace.app,
                    $el = app.elements.contentFirstLoad,
                    view = this.view;

                app.setView('.js-content', view);
                view.withoutRender($el);
            },

            /**
             * TODO: добавить обработку ошибок при получении пользователя
             *
             * Метод вызывает при рендере на клиенте
             *
             * @method
             * @name UsersSettingsController#firstLoad
             * @returns {undefined}
             */
            secondLoad: function () {
                var view = this.view,
                    app = Soshace.app,
                    params = this.routeParams;

                this.model.set({
                    locale: params[0],
                    userName: params[1]
                });

                this.model.getUser().done(_.bind(function () {
                    app.setView('.js-content', view).render();
                }, this));
            }
        });
    });