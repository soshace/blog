'use strict';

/**
 * Контроллер страницы редактирования/добавления статьи
 *
 * @class PostEditController
 */
define([
        'underscore',
        'utils/controller',
        'models/postModel',
        'views/posts/postEditView'
    ],
    function (_, Controller, PostModel, PostEditView) {
        return Controller.extend({
            /**
             * Алиас страницы
             *
             * @field
             * @name PostEditController#pageAlias
             * @type {String}
             */
            pageAlias: 'postEdit',

            /**
             * @field
             * @name PostEditController#model
             * @type {PostModel}
             */
            model: null,

            /**
             * @field
             * @name PostEditController#view
             * @type {PostEditView}
             */
            view: null,

            /**
             * @constructor
             * @name PostEditController#initialize
             * @returns {undefined}
             */
            initialize: function () {
                this.model = new PostModel();
                this.view = new PostEditView({
                    model: this.model
                });
            },

            /**
             * Метод вызывает при рендере на сервере
             *
             * @method
             * @name PostEditController#firstLoad
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
             * @name PostEditController#firstLoad
             * @returns {undefined}
             */
            secondLoad: function () {
                var params = this.routeParams,
                    postId = params[1],
                    view = this.view,
                    app = Soshace.app;

                this.model.getPost(postId).
                    done(function () {
                        app.setView('.js-content', view).render();
                        view.addListeners();
                    });
            }
        });
    });