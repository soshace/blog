'use strict';

/**
 * Вид страницы логина
 *
 * @module LoginView
 */

define([
    'zepto',
    'underscore',
    'backbone',
    'utils/helpers',
    'utils/widgets',
    'handlebars',
    'backbone.validation',
    'utils/backboneValidationExtension',
    'utils/plugins/jquery.controlStatus',
    'backbone.layoutmanager',
    'templates'
], function ($, _, Backbone, Helpers, Widgets, Handlebars) {
    return Backbone.Layout.extend({

        /**
         * Модель формы логина
         *
         * @field
         * @name LoginView#model
         * @type {Backbone.Model | null}
         */
        model: null,

        /**
         * Ссылки на DOM элементы вида
         *
         * @field
         * @name LoginView#elements
         * @type {Object}
         */
        elements: {
            validateFields: null,
            authMessages: null,
            loginForm: null
        },

        /**
         * @field
         * @name LoginView#events
         * @type {Object}
         */
        events: {
            'focus .js-validate-input': 'validateFieldFocusHandler',
            'submit .js-login-form': 'userLoginHandler'
        },

        /**
         * Путь до шаблона
         *
         * @field
         * @name LoginView#template
         * @type {string}
         */
        template: Soshace.hbs['auth/auth'],

        /**
         * @constructor
         * @name LoginView#initialize
         * @returns {undefined}
         */
        initialize: function () {
            _.bindAll(this,
                'userLoginSuccess',
                'userLoginFail'
            );

            Handlebars.registerPartial(
                'auth/login',
                Soshace.hbs['partials/auth/login']
            );

            Backbone.Validation.bind(this);
        },

        /**
         * Метод обработчик клика на кнопке 'Войти'
         *
         * @method
         * @name LoginView#userLoginHandler
         * @param {jQuery.Event} event
         * @returns {undefined}
         */
        userLoginHandler: function (event) {
            var errors,
                _this = this;

            event.preventDefault();
            this.model.set(Helpers.serializeForm(this.elements.loginForm));
            errors = this.model.validate();

            if (errors) {
                this.showFieldsErrors(errors);
                return;
            }

            this.model.save(null, {
                success: _this.userLoginSuccess,
                error: _this.userLoginFail
            });
        },

        /**
         * Метод показывает список ошибок у
         * переданных полей
         *
         * @method
         * @name LoginView#showFieldsErrors
         * @param {Object} errors список ошибок
         * @returns {undefined}
         */
        showFieldsErrors: function (errors) {
            _.each(errors, _.bind(function (error, fieldName) {
                var $field;

                fieldName = Helpers.hyphen(fieldName);
                $field = $('#' + fieldName);
                error = Helpers.i18n(error);
                $field.controlStatus('error', error);
            }, this));
        },

        /**
         * Метод обработчик успешной входа пользователя
         *
         * @method
         * @name LoginView#userLoginSuccess
         * @param {Backbone.Model} model
         * @param {Object} response в ответе приходит профиль пользователя
         * @returns {undefined}
         */
        userLoginSuccess: function (model, response) {
            var app = Soshace.app,
                userName = response.userName,
                locale = response.locale,
                redirectUrl = '/' + locale + '/users/' + userName;

            Soshace.profile = response;
            app.getView('.js-system-messages').collection.fetch().
                done(function () {
                    Backbone.history.navigate(redirectUrl, {trigger: true});
                });
        },

        /**
         * Метод обработчик неуспешного логина пользователя
         *
         * @method
         * @name LoginView#userLoginFail
         * @param {Backbone.Model} model
         * @param {Object} response
         * @returns {undefined}
         */
        userLoginFail: function (model, response) {
            var responseJson = JSON.parse(response.responseText),
                error = responseJson && responseJson.error;

            if (typeof error === 'string') {
                this.showAuthErrorMessage(error);
                return;
            }

            if (typeof error === 'object') {
                this.showFieldsErrors(error);
            }
        },

        /**
         * Method shows error message
         *
         * @method
         * @name LoginView#showAuthErrorMessage
         * @param {string} error
         * @returns {undefined}
         */
        showAuthErrorMessage: function (error) {
            var $authMessages = this.elements.authMessages,
                template = Soshace.hbs['messages/errorMessage']({
                    message: error
                });

            $authMessages.html(template).removeClass('hide');
            Helpers.scrollToElementTop($authMessages);
        },

        /**
         * @method
         * @name LoginView#serialize
         * @returns {Object}
         */
        serialize: function () {
            var data = this.model.toJSON();

            data.isLoginTab = true;
            data.paths = Soshace.urls;
            return data;
        },

        /**
         * Метод сохраняет ссылки на элементы DOM
         *
         * @method
         * @name LoginView#setElements
         * @returns {undefined}
         */
        setElements: function () {
            this.elements.validateFields = this.$('.js-validate-input');
            this.elements.authMessages = this.$('.js-auth-messages');
            this.elements.loginForm = this.$('.js-login-form');
        },

        /**
         * Метод обработчик получения фокуса полем валидации
         *
         * @method
         * @name LoginView#validateFieldFocusHandler
         * @param {jQuery.Event} event
         * @returns {undefined}
         */
        validateFieldFocusHandler: function (event) {
            var $target = $(event.target);

            $target.controlStatus('base');
        },

        /**
         * @method
         * @name LoginView#afterRender
         * @returns {undefined}
         */
        afterRender: function () {
            this.setElements();
            this.elements.validateFields.controlStatus();
            $('#email').focus();
        }
    });
});