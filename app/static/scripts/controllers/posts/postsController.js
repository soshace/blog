'use strict';

/**
 * Контроллер страницы списка статей
 *
 * @class PostsController
 */
define([
    'underscore',
    'utils/controller',
    'collections/postsCollection',
    'views/posts/postsView'
],
    function (_, Controller, PostsCollection, PostsView) {
        return Controller.extend({
            /**
             * Алиас страницы
             *
             * @field
             * @name PostsController#pageAlias
             * @type {String}
             */
            pageAlias: 'home',

            /**
             * @field
             * @name PostsController#collection
             * @type {PostsCollection | null}
             */
            collection: null,

            /**
             * @field
             * @name PostsController#view
             * @type {PostsView | null}
             */
            view: null,

            /**
             * @constructor
             * @name PostsController#initialize
             * @returns {undefined}
             */
            initialize: function () {
                var view;

                this.collection = new PostsCollection();
                view = new PostsView({
                    collection: this.collection
                });
                this.collection.on('postsReceived', _.bind(function () {
                    view.render();
                }, this));
                this.view = view;
            },


            /**
             * Метод вызывает при рендере на сервере
             *
             * @method
             * @name PostsController#firstLoad
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
             * Метод вызывает при рендере на клиенте
             *
             * @method
             * @name PostsController#firstLoad
             * @returns {undefined}
             */
            secondLoad: function () {
                var app = Soshace.app,
                    view = this.view,
                    params = this.routeParams,
                    locale = params[0];

                app.setView('.js-content', view);
                this.collection.getPosts({locale: locale});
            }
        });
    });