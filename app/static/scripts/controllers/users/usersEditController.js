'use strict';

/**
 * Контроллер страницы редактирования пользователя
 *
 * @class UsersEditController
 */
define([
        'underscore',
        'utils/controller',
        'models/usersModel',
        'views/users/usersEditView'
    ],
    function (_, Controller, UsersModel, UsersEditView) {
        return Controller.extend({
            /**
             * Алиас страницы
             *
             * @field
             * @name UsersEditController#pageAlias
             * @type {String}
             */
            pageAlias: 'userEdit',

            /**
             * @field
             * @name UsersEditController#model
             * @type {UsersModel | null}
             */
            model: null,

            /**
             * @field
             * @name UsersEditController#view
             * @type {UsersEditView | null}
             */
            view: null,

            /**
             * @constructor
             * @name UsersEditController#initialize
             * @returns {undefined}
             */
            initialize: function () {
                var model,
                    view;

                model = new UsersModel();
                view = new UsersEditView({
                    model: model
                });

                this.model = model;
                this.view = view;
            },


            /**
             * Метод вызывает при рендере на сервере
             *
             * @method
             * @name UsersEditController#firstLoad
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
             * @name UsersEditController#firstLoad
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