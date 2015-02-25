'use strict';

/**
 * Коллекция списка сообщений ревью статьи
 *
 * @class ReviewCommentsCollection
 */

define([
    'zepto',
    'underscore',
    'backbone',
    'models/reviewCommentsModel',
    'config'
], function ($, _, Backbone, ReviewCommentsModel) {
    return Backbone.Collection.extend({
        /**
         * Модель превью поста
         *
         * @field
         * @name ReviewCommentsCollection#model
         * @type {PostModel}
         */
        model: ReviewCommentsModel,

        /**
         * @method
         * @name ReviewCommentsCollection#initialize
         * @returns {string}
         */
        url: Soshace.urls.api.reviewComments,

        /**
         * @constructor
         * @name ReviewCommentsCollection#initialize
         * @returns {undefined}
         */
        initialize: function () {
            _.bindAll(this, 'getPostsSuccess');
        },

        /**
         * TODO: добавить обработку ошибок
         *
         * Используется такой способ получения постов, чтобы сделать свой триггер
         * Т.к. change не отрабатывает при полуении такой же модели
         *
         * @method
         * @name ReviewCommentsCollection#getPosts
         * @param {Object} params параметры запроса
         * @returns {undefined}
         */
        getPosts: function (params) {
            this.fetch({
                data: params,
                silent: true
            }).done(this.getPostsSuccess);
        },

        /**
         * Метод обработчик удачного получения списка постов
         *
         * @method
         * @name ReviewCommentsCollection#getPostsSuccess
         * @param {Array} postsList список постов
         * @returns {undefined}
         */
        getPostsSuccess: function (postsList) {
            if (postsList instanceof Array && postsList.length === 0) {
                postsList = null;
            }
            this.set(postsList, {silent: true});
            this.trigger('postsReceived');
        }
    });
});