//TODO: добавить оповещение при смене статуса
'use strict';

/**
 * Вид страницы адмистрирования статьи
 *
 * У страниц адмистрирования нет клиентского роутинга
 * и шаблонизации, т.к. на клиенте не должно быть никаких упоминаний
 * о наличии страницы адмистрирования и API для адмистрования
 *
 * Так же скрипты админки не участвуют в общей сборке
 *
 * @module PostReView
 */

define([
    'zepto',
    'underscore',
    'backbone',
    'models/postModel',
    'collections/reviewCommentsCollection'
], function ($, _, Backbone, PostModel, ReviewCommentsCollection) {
    return Backbone.View.extend({

        /**
         * Модель статьи
         *
         * @field
         * @name PostReView#postModel
         * @type {PostModel | null}
         */
        postModel: null,

        /**
         * Коллекция комментариев ревью статьи
         *
         * @field
         * @name PostReView#reviewCommentsCollection
         * @type {ReviewCommentsCollection}
         */
        reviewCommentsCollection: null,

        /**
         * @field
         * @name PostReView#el
         * @type {String}
         */
        el: '.js-post-review',

        /**
         * @field
         * @name PostReView#elements
         * @type {Object}
         */
        elements: {
            post: null,
            postTitle: null,
            postBody: null
        },

        /**
         * @field
         * @name PostReView#events
         * @type {Object}
         */
        events: {
            'change .js-select': 'selectChangeHandler',
            'submit': 'submitHandler'
        },

        /**
         * @constructor
         * @name PostReView#initialize
         * @returns {undefined}
         */
        initialize: function () {
            this.postModel = new PostModel();
            this.setElements();
            this.setDataToModelFromView();
        },

        /**
         * Метод обработчик изменения выпадающих списоков
         *
         * @method
         * @name PostReView#selectChangeHandler
         * @param {jQuery.Event} event
         * @returns {undefined}
         */
        selectChangeHandler: function(event){
            var $target = $(event.target),
                name = $target.attr('name'),
                value = $target.val();

            this.postModel.set(name, value);
        },

        /**
         * Метод обработчик отправки формы
         *
         * @method
         * @name PostReView#submitHandler
         * @param {jQuery.Event} event
         * @returns {undefined}
         */
        submitHandler: function(event){
            event.preventDefault();
            this.postModel.patchModel();
        },

        /**
         * Метод берет данные из шаблона и сетит модель статьи
         *
         * @method
         * @name PostReView#setDataToModelFromView
         * @returns {undefined}
         */
        setDataToModelFromView: function(){
            var body = this.elements.postBody.html(),
                title = this.elements.postTitle.html(),
                ownerId = this.elements.post.data('ownerId'),
                postId = this.elements.post.data('postId');

            this.postModel.set({
                _id: postId,
                ownerId: ownerId,
                title: title,
                body: body
            }, {silent: true});
        },

        /**
         * Метод сохраняет ссылки на элементы DOM
         *
         * @method
         * @name PostReView#setElements
         * @returns {undefined}
         */
        setElements: function(){
            this.elements.postTitle = this.$('.js-title');
            this.elements.postBody = this.$('.js-body');
            this.elements.post = this.$('.js-post');
        }
    });
});