'use strict';

/**
 * Модель страницы логина
 *
 * @module LoginModel
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
         * @property
         * @name LoginModel#defaults
         * @type {Object}
         */
        defaults: {
            locale: null,
            email: null,
            password: null
        },

        /**
         * @field
         * @name LoginModel#validation
         * @type {Object}
         */
        validation: {
            email: [
                {
                    required: true,
                    msg: 'Email can&#39;t be blank.'
                },
                {
                    pattern: Soshace.patterns.email,
                    msg: 'Email is invalid.'
                }
            ],
            password: [
                {
                    required: true,
                    msg: 'Password can&#39;t be blank.'
                },
                {
                    minLength: 6,
                    msg: 'Password length should&#39;t be less than 6 characters.'
                }
            ]
        },

        /**
         * @field
         * @name LoginModel#url
         * @type {String}
         */
        url: Soshace.urls.api.login,

        /**
         * @constructor
         * @name LoginModel#initialize
         * @returns {undefined}
         */
        initialize: function () {
            var locale = Helpers.getLocale();
            this.set({locale: locale}, {silent: true});
        }
    });
});