'use strict';

/**
 * Вид страницы пользователя
 *
 * @class UsersView
 */

define([
    'zepto',
    'underscore',
    'backbone',
    'handlebars',
    'utils/helpers',
    './../posts/postPreviewView',
    'backbone.layoutmanager',
    'templates'
], function ($, _, Backbone, Handlebars, Helpers, PostPreviewView) {
    return Backbone.Layout.extend({
        /**
         * Модель деталей статьи
         *
         * @field
         * @name UsersView#model
         * @type {Backbone.Model | null}
         */
        model: null,

        /**
         * Коллекция статей
         *
         * @field
         * @name UsersView#postsCollection
         * @type {Backbone.Model | null}
         */
        postsCollection: null,

        /**
         * Ссылки на DOM элементы
         *
         * @field
         * @name UsersView#elements
         * @type {Object}
         */
        elements: {
            postsPreviews: null,
            user: null,
        },

        /**
         * Путь до шаблона
         *
         * @field
         * @name UsersView#elements
         * @type {string}
         */
        template: Soshace.hbs['users/users'],

        /**
         * @constructor
         * @name UsersView#initialize
         * @returns {undefined}
         */
        initialize: function () {
            Handlebars.registerPartial(
                'usersTabs',
                Soshace.hbs['partials/usersTabs']
            );
        },

        /**
         * Метод заполняет данными модель из шаблона
         *
         * @method
         * @name UsersView#setModelFromTemplate
         * @returns {undefined}
         */
        setModelFromTemplate: function () {
            var $user = this.elements.user,
                userData = $user.data();

            this.model.set(userData);
        },

        /**
         * Метод заполняет данными коллекцию статей и устанавливает виды preview используя
         * данные из шаблона
         *
         * @method
         * @name UsersView#setPreViewsFromTemplate
         * @returns {undefined}
         */
        setPreViewsFromTemplate: function () {
            var _this = this,
                collection = this.postsCollection,
                PostModel = collection.model,
                postsPreviews = this.elements.postsPreviews;

            postsPreviews.each(function () {
                var $this = $(this),
                    model,
                    view,
                    data = $this.data(),
                    $title = $('.js-title', $this),
                    $description = $('.js-description', $this),
                    title = $title.html(),
                    description = $description.html();

                model = new PostModel(_.extend(data, {
                    title: title,
                    description: description
                }));

                view = new PostPreviewView({
                    model: model
                });

                view.$el = $this;
                view.withoutRender();
                _this.insertView('.js-posts-list', view);
                collection.add(model);
            });
        },

        /**
         * Метод добавляет вид превью с списку статей
         *
         * @method
         * @name UsersView#addOneView
         * @param {Backbone.Model} postModel модель статьи
         * @returns {undefined}
         */
        addOneView: function (postModel) {
            var view = new PostPreviewView({
                model: postModel
            });

            this.insertView('.js-posts-list', view);
        },

        /**
         * Метод заполняет список статей
         *
         * @method
         * @name UsersView#fillPostsList
         * @returns {undefined}
         */
        fillPostsList: function () {
            this.postsCollection.each(_.bind(this.addOneView, this));
        },

        /**
         * Метод возвращает полное имя и фамилию пользователя
         *
         * @method
         * @name UsersView#getFullName
         * @returns {string}
         */
        getFullName: function(){
            var firstName = this.model.get('firstName'),
                lastName = this.model.get('lastName'),
                fullName = [];

            if(lastName !== null){
                fullName.push(lastName);
            }

            if(firstName !== null){
                fullName.push(firstName);
            }

            return fullName.join(' ');
        },

        /**
         * @method
         * @name UsersView#serialize
         * @returns {Object}
         */
        serialize: function () {
            var app = Soshace.app,
                isAuthenticated = app.isAuthenticated(),
                data = {},
                model = this.model.toJSON(),
                profile = Soshace.profile,
                isOwner = isAuthenticated && model._id === profile._id;

            data.user = model;
            data.posts = this.postsCollection.toJSON();
            data.isOwner = isOwner;
            data.isUserMainTab = true;
            data.locale = Helpers.getLocale();
            data.user.fullName = this.getFullName();
            data.isProfileInfoEmpty = this.model.isProfileInfoEmpty();

            return data;
        },

        /**
         * Метод сохраняет DOM элементы
         *
         * @method
         * @name UsersView#setElements
         * @returns {undefined}
         */
        setElements: function () {
            this.elements.postsPreviews = this.$('.js-post-preview');
            this.elements.user = this.$('.js-user');
        },

        /**
         * Метод запускается, когда рендеринг шаблона происходит на сервере
         *
         * @method
         * @name UsersView#withoutRender
         * @param {jQuery} $el корневой элемент
         * @returns {undefined}
         */
        withoutRender: function ($el) {
            this.$el = $el;
            this.delegateEvents();
            this.setElements();
            this.setModelFromTemplate();
            this.setPreViewsFromTemplate();
        },

        /**
         * @method
         * @name UsersView#beforeRender
         * @returns {undefined}
         */
        beforeRender: function () {
            this.fillPostsList();
        },

        /**
         * @method
         * @name UsersView#afterRender
         * @returns {undefined}
         */
        afterRender: function () {
            this.setElements();
        }
    });
});