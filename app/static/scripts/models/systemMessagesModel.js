'use strict';

/**
 * Модель системного сообщения
 *
 * @class SystemMessagesModel
 */

define([
    'zepto',
    'underscore',
    'backbone',
    'config'
], function ($, _, Backbone) {
    return Backbone.Model.extend({

        /**
         * @field
         * @name SystemMessagesModel#idAttribute
         * @type {String}
         */
        idAttribute: '_id',

        /**
         * @field
         * @name SystemMessagesModel#defaults
         * @type {Object}
         */
        defaults: {
            _id: null,
            //сокращение для системного сообщения
            alias: null,
            //id пользователя, к которому относится сообщение
            ownerId: null,
            //путь до шаблона системного уведомления
            templatePath: null,
            //Параметры, которые передаются в шаблон
            templateOptions: null,
            //Сообщение закрывается пользователем
            closedByUser: false,
            //Сообщение показывается только один раз
            showOnce: null,
            //страницы на которых может быть показано сообщение
            pages: null,
            //true - сообщение не может быть удалено или измененно клиентским запросом
            readOnly: false
        },

        /**
         * @method
         * @name SystemMessagesModel#url
         * @returns {String}
         */
        url: function(){
            var id = this.get('_id');
            return Soshace.urls.api.systemMessage.replace('0', id);
        },

        /**
         * @constructor
         * @name SystemMessagesModel#initialize
         * @returns {undefined}
         */
        initialize: function () {
        }
    });
});