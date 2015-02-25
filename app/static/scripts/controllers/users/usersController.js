'use strict';

/**
 * Контроллер страницы пользователя
 *
 * @class UsersController
 */
define([
        'underscore',
        'utils/controller',
        'models/usersModel',
        'collections/postsCollection',
        'views/users/usersView'
    ],
    function (_, Controller, UsersModel, PostsCollection, UsersView) {
        return Controller.extend({
            /**
             * Алиас страницы
             *
             * @field
             * @name UsersController#pageAlias
             * @type {String}
             */
            pageAlias: 'user',

            /**
             * @field
             * @name UsersController#model
             * @type {UsersModel | null}
             */
            model: null,

            /**
             * @field
             * @name UsersController#postsCollection
             * @type {PostsCollection | null}
             */
            postsCollection: null,

            /**
             * @field
             * @name UsersController#view
             * @type {UsersView | null}
             */
            view: null,

            /**
             * @constructor
             * @name UsersController#initialize
             * @returns {undefined}
             */
            initialize: function () {
                var app = Soshace.app,
                    model,
                    view,
                    postsCollection;

                model = new UsersModel();
                postsCollection = new PostsCollection();
                postsCollection.on('postsReceived', _.bind(function () {
                    app.setView('.js-content', view).render();
                }, this));

                view = new UsersView({
                    postsCollection: postsCollection,
                    model: model
                });

                this.model = model;
                this.view = view;
                this.postsCollection = postsCollection;
            },


            /**
             * Метод вызывает при рендере на сервере
             *
             * @method
             * @name UsersController#firstLoad
             * @returns {undefined}
             */
            firstLoad: function () {
                var app = Soshace.app,
                    $contentFirstLoad = app.elements.contentFirstLoad,
                    view = this.view;

                app.setView('.js-content', view);
                view.withoutRender($contentFirstLoad);
            },

            /**
             * TODO: добавить обработку ошибок при получении статей
             *
             * Метод вызывает при рендере на клиенте
             *
             * @method
             * @name UsersController#firstLoad
             * @returns {undefined}
             */
            secondLoad: function () {
                var params = this.routeParams;
                this.model.set({
                    locale: params[0],
                    userName: params[1]
                });

                this.model.getUser().done(_.bind(function (response) {
                    this.postsCollection.getPosts({ownerId: response._id});
                }, this));
            }
        });
    });