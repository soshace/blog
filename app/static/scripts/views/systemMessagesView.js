'use strict';

/**
 * Вид блока системных уведомлений
 *
 * @class SystemMessagesView
 */

define([
    'zepto',
    'underscore',
    'backbone',
    'backbone.layoutmanager',
    'templates'
], function ($, _, Backbone) {
    return Backbone.Layout.extend({

        /**
         * @field
         * @name SystemMessagesView#collection
         * @type {SystemMessagesCollection | null}
         */
        collection: null,

        /**
         * Модель подходящего системного сообщения
         *
         * @field
         * @name SystemMessagesView#model
         * @type {Backbone.Model | null}
         */
        model: null,

        /**
         * @field
         * @name SystemMessagesView#elements
         * @type {Object}
         */
        elements: {
        },

        /**
         * Список обработчиков событий
         *
         * @field
         * @name SystemMessagesView#events
         * @type {Object}
         */
        events: {
        },

        /**
         * Путь до шаблона
         *
         * @field
         * @name SystemMessagesView#template
         * @type {string}
         */
        template: null,

        /**
         * @constructor
         * @name SystemMessagesView#initialize
         * @param {Object} params
         * @returns {undefined}
         */
        initialize: function (params) {
            this.collection = params.collection;
            this.collection.on('sync', this.saveMessagesGlobal, this);
        },

        /**
         * Метод сохраняет системные сообщения в глобальной переменной
         * Soshace.systemMessages
         *
         * @method
         * @name SystemMessagesView#saveMessagesGlobal
         * @returns {undefined}
         */
        saveMessagesGlobal: function () {
            Soshace.systemMessages = this.collection.toJSON();
        },

        /**
         * Метод возвращает модель первого доступного
         * сообщения для показа на данной странице
         *
         * @method
         * @name SystemMessagesView#getFirsAvailableMessage
         * @param {String} pageAlias сокращенное название страницы
         * @returns {Backbone.Model}
         */
        getFirsAvailableMessage: function (pageAlias) {
            return this.collection.find(function (model) {
                return _.indexOf(model.get('pages'), pageAlias) !== -1;
            });
        },

        /**
         * Метод проверяет системное сообщение на наличие флага
         * showOnce - показ только один раз
         *
         * @method
         * @name SystemMessagesView#checkShowOnceFlag
         * @returns {undefined}
         */
        checkShowOnceFlag: function () {
            if (this.model.get('showOnce')) {
                this.model.destroy();
            }
        },

        /**
         * Метод обработчик смены страницы
         *
         * @method
         * @name SystemMessagesView#changePage
         * @param {String} pageAlias сокращенное название страницы
         * @returns {undefined}
         */
        changePage: function (pageAlias) {
            var templatePath;
            this.model = this.getFirsAvailableMessage(pageAlias);

            if (this.model) {
                templatePath = this.model.get('templatePath');
                this.template = Soshace.hbs[templatePath];
                this.render();
                return;
            }

            this.$el.empty();
        },

        /**
         * @method
         * @name SystemMessagesView#afterRender
         * @returns {undefined}
         */
        afterRender: function () {
            this.checkShowOnceFlag();
        }
    });
});