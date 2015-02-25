'use strict';

/**
 * Модель страницы регистрации
 *
 * @class RegistrationModel
 */

define([
    'zepto',
    'underscore',
    'backbone',
    'utils/helpers',
    'backbone.validation',
    'utils/backboneValidationExtension',
    'config'
], function ($, _, Backbone, Helpers) {
    return Backbone.Model.extend({
        /**
         * @field
         * @name RegistrationModel#defaults
         * @type {Object}
         */
        defaults: {
            locale: null,
            email: null,
            password: null,
            userName: null
        },

        /**
         * @field
         * @name RegistrationModel#validation
         * @type {Object}
         */
        validation: {
            userName: [
                {
                    required: true,
                    msg: 'Username can&#39;t be blank.'
                },
                {
                    userName: 1
                }
            ],
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
         * Список подсказок к полям
         *
         * @field
         * @name RegistrationModel#helpers
         * @type {Object}
         */
        helpers: {
            userName: 'Use the Latin alphabet, numbers, &#34;.&#34;, &#34;_&#34;, &#34;-&#34;.',
            email: 'Please enter your e-mail address.',
            password: 'Use the numbers, upper-and lowercase letters, symbols'
        },

        /**
         * Список подписей к успешным полям
         *
         * @field
         * @name RegistrationModel#successMessages
         * @type {Object}
         */
        successMessages: {
            userName: 'Great username!',
            email: 'Great email!',
            password: 'Great password!'
        },

        /**
         * @field
         * @name RegistrationModel#url
         * @type {string}
         */
        url: Soshace.urls.api.createUser,

        /**
         * @constructor
         * @name RegistrationModel#initialize
         * @returns {undefined}
         */
        initialize: function () {
            var locale = Helpers.getLocale();
            this.set({locale: locale}, {silent: true});
        },

        /**
         * Метод делает запрос на валидацию поля на сервере
         *
         * @method
         * @name RegistrationModel#validation
         * @param {Object} serializedField
         * @returns {jQuery.Deferred}
         */
        validateFieldByServer: function (serializedField) {
            var params = {},
                name = serializedField.name;

            params[name] = serializedField.value;
            //Используется post запрос для защиты пользовательских данных
            return $.post(Soshace.urls.api.registration.validateField, params);
        }
    });
});