'use strict';

/**
 * Вид страницы регистрации
 *
 * @class RegistrationView
 */

define([
    'zepto',
    'underscore',
    'backbone',
    'utils/helpers',
    'handlebars',
    'backbone.validation',
    'utils/backboneValidationExtension',
    'utils/plugins/jquery.controlStatus',
    'backbone.layoutmanager',
    'templates'
], function ($, _, Backbone, Helpers, Handlebars) {
    return Backbone.Layout.extend({

        /**
         * Модель формы регистрации
         *
         * @field
         * @name RegistrationView#model
         * @type {Backbone.Model | null}
         */
        model: null,

        /**
         * Ссылки на DOM элементы вида
         *
         * @field
         * @name RegistrationView#elements
         * @type {Object}
         */
        elements: {
            registrationForm: null
        },

        /**
         * Поле содержит обернутые в debounce
         * методы setStatus отдельно для каждого поля
         *
         * У каждого поля должен быть свой debouce метод,
         * чтобы ошибки показывались при быстрой смене фокуса
         *
         * @field
         * @name RegistrationView#statusDebounceHandlers
         * @type {Object | null}
         */
        statusDebounceHandlers: null,

        /**
         * Список обработчиков событий
         *
         * @field
         * @name RegistrationView#events
         * @type {Object}
         */
        events: {
            'keyup .js-model-field': 'changeFormFieldHandler',
            'focus .js-model-field': 'focusFormFieldHandler',
            'blur .js-model-field': 'changeFormFieldHandler',
            'submit': 'userRegistrationHandler'
        },

        /**
         * Путь до шаблона
         *
         * @field
         * @name RegistrationView#template
         * @type {string}
         */
        template: Soshace.hbs['auth/auth'],

        /**
         * @constructor
         * @name RegistrationView#initialize
         * @returns {undefined}
         */
        initialize: function () {
            _.bindAll(this,
                'userRegistrationSuccess',
                'userRegistrationFail'
            );

            Handlebars.registerPartial(
                'auth/registration',
                Soshace.hbs['partials/auth/registration']
            );
            Backbone.Validation.bind(this);

            this.statusDebounceHandlers = {};
            this.setStatusHandlers();
        },

        /**
         * Метод уставливает оберные для в debounce метод setStatus для каждого поля модели
         *
         * @method
         * @name RegistrationView#setStatusHandlers
         * @returns {undefined}
         */
        setStatusHandlers: function () {
            var model = this.model.toJSON();

            _.each(model, _.bind(function (fieldValue, fieldName) {
                this.statusDebounceHandlers[fieldName] = _.debounce(_.bind(this.setStatus, this), 500);
            }, this));
        },

        /**
         * Метод обработчик клика на кнопке 'Зарегистрироваться'
         *
         * @method
         * @name RegistrationView#userRegistrationHandler
         * @param {jQuery.Event} event
         * @returns {undefined}
         */
        userRegistrationHandler: function (event) {
            var errors,
                _this = this;

            event.preventDefault();
            this.model.set(Helpers.serializeForm(this.elements.registrationForm));
            errors = this.model.validate();

            if (errors) {
                this.showFieldsErrors(errors, true);
                return;
            }

            this.model.save(null, {
                success: _this.userRegistrationSuccess,
                error: _this.userRegistrationFail
            });
        },

        /**
         * Метод обработчик успешной регистрации пользователя
         *
         * @method
         * @name RegistrationView#userRegistrationSuccess
         * @param {Backbone.Model} model
         * @param {Object} response
         * @returns {undefined}
         */
        userRegistrationSuccess: function (model, response) {
            var app = Soshace.app,
                redirectUrl = response.redirect;

            Soshace.profile = response.profile;
            app.getView('.js-system-messages').collection.fetch().
                done(function () {
                    Backbone.history.navigate(redirectUrl, {trigger: true});
                });
        },

        /**
         * Метод обработчик неуспешной регистрации пользователя
         *
         * @method
         * @name RegistrationView#userRegistrationFail
         * @param {Backbone.Model} model
         * @param {Object} response
         * @returns {undefined}
         */
        userRegistrationFail: function (model, response) {
            var error = response.responseJSON && response.responseJSON.error;

            if (typeof error === 'string') {
                //TODO: добавить вывод системной ошибки
                return;
            }

            if (typeof error === 'object') {
                this.showFieldsErrors(error);
            }
        },

        /**
         * Метод обработчик получения фокуса полем
         *
         * @method
         * @name RegistrationView#focusFormFieldHandler
         * @param {jQuery.Event} event
         * @returns {undefined}
         */
        focusFormFieldHandler: function (event) {
            var $target = $(event.target),
                controlStatusData = $target.data('controlStatus'),
                status = controlStatusData.status;

            if (status === 'success') {
                return;
            }

            if (status === 'error') {
                return;
            }

            $target.controlStatus('helper');
        },

        /**
         * Метод обработчик события изменения поля формы
         *
         * @method
         * @name RegistrationView#changeFormFieldHandler
         * @param {jQuery.Event} event
         * @returns {undefined}
         */
        changeFormFieldHandler: function (event) {
            var $target = $(event.target),
                model = this.model,
                serializedField = Helpers.serializeField($target),
                fieldName = serializedField.name,
                fieldValue = serializedField.value,
                setStatusHandler;

            if (model.get(fieldName) === fieldValue) {
                return;
            }

            //TODO: вынести в отдельный метод с сохранением позиции курсора
            //fieldValue = fieldValue.toLowerCase();
            //$target.val(fieldValue);
            model.set(fieldName, fieldValue);
            $target.controlStatus('helper');
            setStatusHandler = this.statusDebounceHandlers[fieldName];
            setStatusHandler($target, serializedField);
        },

        /**
         * Метод устанавливает статусы для полей success или error
         *
         * @method
         * @name RegistrationView#setStatus
         * @param {jQuery} $field ссылка на поле
         * @param serializedField сериализованное поле {name: '', value: ''}
         * @returns {undefined}
         */
        setStatus: function ($field, serializedField) {
            var model = this.model,
                fieldValue = serializedField.value,
                fieldName = serializedField.name,
                error;

            if (fieldValue !== model.get(fieldName)) {
                return;
            }

            error = model.preValidate(fieldName, fieldValue);

            if (error) {
                error = Helpers.i18n(error);
                $field.controlStatus('error', error);
                return;
            }

            model.validateFieldByServer(serializedField).done(function () {
                //В случае, если поле пока шел ответ уже изменилось
                if (fieldValue !== model.get(fieldName)) {
                    return;
                }

                $field.controlStatus('success');
            }).fail(function (response) {
                var errorMessage,
                    responseJSON;

                //В случае, если поле пока шел ответ уже изменилось
                if (fieldValue !== model.get(fieldName)) {
                    return;
                }

                responseJSON = JSON.parse(response.response);
                error = responseJSON.error;
                errorMessage = Helpers.i18n(error.message);
                $field.controlStatus('error', errorMessage);
            });
        },

        /**
         * @method
         * @name RegistrationView#serialize
         * @returns {Object}
         */
        serialize: function () {
            var data = this.model.toJSON();

            data.isRegistrationTab = true;
            return data;
        },

        /**
         * Метод показывает список ошибок у
         * переданных полей
         *
         * @method
         * @name RegistrationView#showFieldsErrors
         * @param {Object} errors список ошибок
         * @param {Boolean} [translate] true - перевести ошибки
         * @returns {undefined}
         */
        showFieldsErrors: function (errors, translate) {
            _.each(errors, _.bind(function (error, fieldName) {
                var $field;

                fieldName = Helpers.hyphen(fieldName);
                $field = $('#' + fieldName);
                if (translate) {
                    error = Helpers.i18n(error);
                }
                $field.controlStatus('error', error);
            }, this));
        },

        /**
         * Метод устанавливает всплывающие подсказоки у полей
         *
         * @method
         * @name RegistrationView#setFieldsHelpers
         * @param {Object} helpers список подсказок
         * @returns {undefined}
         */
        setFieldsHelpers: function (helpers) {
            _.each(helpers, _.bind(function (helper, fieldName) {
                var $field,
                    successTitle = this.model.successMessages[fieldName];

                fieldName = Helpers.hyphen(fieldName);
                $field = $('#' + fieldName);
                $field.controlStatus({
                    helperTitle: Helpers.i18n(helper),
                    successTitle: Helpers.i18n(successTitle)
                });
            }, this));
        },

        /**
         * Метод сохраняет ссылки на элементы DOM
         *
         * @method
         * @name RegistrationView#setElements
         * @returns {undefined}
         */
        setElements: function () {
            this.elements.registrationForm = this.$('.js-registration-form');
        },

        /**
         * @method
         * @name RegistrationView#afterRender
         * @returns {undefined}
         */
        afterRender: function () {
            this.setElements();
            this.setFieldsHelpers(this.model.helpers);
            //Используется асинхронный вызов, чтобы навесились обработчики событий
            setTimeout(function () {
                $('#user-name').focus();
            }, 0);
        }
    });
});