'use strict';

/**
 * Контроллер страницы просмотра статьи
 *
 * @class PostController
 */
define([
        'underscore',
        'utils/controller',
        'models/postModel',
        'views/posts/postView'
    ],
    function (_, Controller, PostModel, PostView) {
        return Controller.extend({
            /**
             * Алиас страницы
             *
             * @field
             * @name PostController#pageAlias
             * @type {String}
             */
            pageAlias: 'postDetail',

            /**
             * @field
             * @name PostController#model
             * @type {PostModel}
             */
            model: null,

            /**
             * @field
             * @name PostController#view
             * @type {PostView}
             */
            view: null,

            /**
             * @constructor
             * @name
             * @returns {undefined}
             */
            initialize: function () {
                this.model = new PostModel();
                this.view = new PostView({
                    model: this.model
                });
            },


            /**
             * Метод вызывает при рендере на сервере
             *
             * @method
             * @name PostController#firstLoad
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
             * @name PostController#firstLoad
             * @returns {undefined}
             */
            secondLoad: function () {
                var params = this.routeParams,
                    postId = params[1],
                    view = this.view,
                    app = Soshace.app;

                this.model.getPost(postId).
                    done(function(){
                        app.setView('.js-content', view).render();
                    });
            }
        });
    });