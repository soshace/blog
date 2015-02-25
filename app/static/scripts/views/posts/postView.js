'use strict';

/**
 * Вид страницы просмотра статьи
 *
 * @class PostView
 */

define([
    'zepto',
    'underscore',
    'backbone',
    'handlebars',
    'utils/helpers',
    'backbone.layoutmanager',
    'templates'
], function ($, _, Backbone, Handlebars, Helpers) {
    return Backbone.Layout.extend({

        /**
         * Модель деталей статьи
         *
         * @field
         * @name PostView#model
         * @type {Backbone.Model | null}
         */
        model: null,

        /**
         * @field
         * @name PostView#elements
         * @type {Object}
         */
        elements: {
            metaDataPanel: null,
            post: null,
            title: null,
            body: null
        },

        /**
         * Путь до шаблона
         *
         * @field
         * @name PostView#elements
         * @type {string}
         */
        template: Soshace.hbs['posts/post'],

        /**
         * @constructor
         * @name PostView#initialize
         * @returns {undefined}
         */
        initialize: function () {
            Handlebars.registerPartial(
                'intro',
                Soshace.hbs['partials/intro']
            );
        },

        /**
         * @method
         * @name PostView#serialize
         * @returns {Object}
         */
        serialize: function () {
            var app = Soshace.app,
                data = {},
                model = this.model.toJSON();

            data.isAuthenticated = app.isAuthenticated();
            data.post = model;
            data.paths = Soshace.urls;
            data.locale = Helpers.getLocale();
            return data;
        },

        /**
         * Метод заполняет данными модель из шаблона
         *
         * @method
         * @name PostsView#setModelFromTemplate
         * @returns {undefined}
         */
        setModelFromTemplate: function () {
            var model = this.model,
                $post = this.elements.post,
                data = $post.data(),
                $title = this.elements.title,
                $body = this.elements.body,
                title = $title.html(),
                body = $body.html();

            model.set(_.extend(data, {
                title: title,
                body: body
            }), {silent: true});
        },

        /**
         * Метод возвращает true, если текущий авторизованный пользователь является владельцем
         *
         * @method
         * @name PostView#addMetaData
         * @returns {Boolean}
         */
        isOwner: function () {
            var app = Soshace.app,
                profileId,
                ownerId;

            if (!app.isAuthenticated()) {
                return false;
            }

            profileId = Soshace.profile._id;
            ownerId = this.model.get('ownerId');

            return profileId === ownerId;
        },

        /**
         * Метод добавляет ланные (статус, дату публикации и пр.) к превью статьи
         *
         * @method
         * @name PostView#addMetaData
         * @returns {undefined}
         */
        addMetaData: function () {
            var metaData = this.getMetaData();
            this.elements.metaDataPanel.html(metaData);
        },

        /**
         * Метод возвращает отрендеренную панель информации для превью статьи
         *
         * @method
         * @name PostView#getMetaData
         * @returns {undefined}
         */
        getMetaData: function () {
            var model = this.model.toJSON(),
                isOwner = this.isOwner(),
                status = this.model.get('status'),
                statusSettings = this.model.statuses[status],
                statusClass = statusSettings.class,
                statusTitle = statusSettings.title,
                editorEnable = statusSettings.editorEnable;

            return Soshace.hbs['posts/edit/postMetaData'](_.extend(model, {
                isOwner: isOwner,
                editorEnable: editorEnable,
                statusClass: statusClass,
                statusTitle: statusTitle
            }));
        },

        /**
         * Метод сохраняет ссылки на DOM элементы
         *
         * @method
         * @name PostView#setElements
         * @returns {undefined}
         */
        setElements: function () {
            this.elements.metaDataPanel = this.$('.js-meta-data');
            this.elements.post = this.$('.js-post');
            this.elements.title = this.$('.js-title');
            this.elements.body = this.$('.js-body');
        },

        /**
         * Метод вызывается, когда шаблон рендерится на сервере
         *
         * @method
         * @name PostView#withoutRender
         * @param {jQuery} $el
         * @returns {undefined}
         */
        withoutRender: function($el){
            var app = Soshace.app;

            this.$el = $el;
            this.setElements();
            this.delegateEvents();
            this.setModelFromTemplate();
            this.addMetaData();
            app.elements.title.html(this.model.get('title'));
        },

        /**
         * @method
         * @name PostView#afterRender
         * @returns {undefined}
         */
        afterRender: function () {
            var app = Soshace.app;

            this.setElements();
            this.addMetaData();
            app.elements.title.html(this.model.get('title'));
        }
    });
});