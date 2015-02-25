'use strict';

/**
 * Расширение для Backbone.Validation
 */

define([
    'zepto',
    'underscore',
    'backbone',
    'backbone.validation',
    'config'
], function ($, _, Backbone) {
    _.extend(Backbone.Validation.validators, {
        /**
         * Метод валидации userName
         *
         * @method
         * @param {String} value
         * @returns {String | undefined}
         */
        userName: function (value) {
            if (!Soshace.patterns.userName.test(value)) {
                return 'Use the Latin alphabet, numbers, &#34;.&#34;, &#34;_&#34;, &#34;-&#34;.';
            }
        }
    });
});