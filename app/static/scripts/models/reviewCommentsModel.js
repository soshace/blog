'use strict';

/**
 * Модель комментариев ревью статьи
 *
 * @class ReviewCommentsModel
 */

define([
    'zepto',
    'underscore',
    'backbone',
    'utils/helpers',
    'config'
], function ($, _, Backbone, Helpers) {
    return Backbone.Model.extend({
        /**
         * @field
         * @name ReviewCommentsModel#idAttribute
         * @type {String}
         */
        idAttribute: '_id',

        /**
         * @field
         * @name ReviewCommentsModel#default
         * @type {String | null}
         */
        default: {
            _id: null,
            locale: null,
            //Загловок поста
            title: null,
            //Категория, используется в урлах
            category: null,
            //Тело поста
            body: null
        },

        /**
         * Список статусов статьи
         *
         * @field
         * @name ReviewCommentsModel#statuses
         * @type {Object}
         */
        statuses: {
            saved: {
                title: 'Post saved',
                class: 'label-primary'
            },
            editing: {
                title: 'Post is editing...',
                class: 'label-default'
            },
            sent: {
                title: 'Post sent',
                class: 'label-primary'
            },
            published: {
                title: 'Post published',
                class: 'label-success'
            },
            denied: {
                title: 'Publication denied',
                class: 'label-danger'
            },
            comments: {
                title: 'Some comments',
                class: 'label-warning'
            }
        },

        /**
         * @method
         * @name ReviewCommentsModel#url
         * @returns {string}
         */
        url: function () {
            var url = Soshace.urls.api.post,
                _id = this.get('_id');

            if (_id) {
                return url.replace('0', _id);
            }

            return url.replace('0', '');
        },

        /**
         * @constructor
         * @name ReviewCommentsModel#initialize
         * @returns {undefined}
         */
        initialize: function () {
            this.set('locale', Helpers.getLocale(), {silent: true});
        }
    });
});