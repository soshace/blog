'use strict';

/**
 * Коллекция системных сообщений
 *
 * @class SystemMessagesCollection
 */

define([
    'zepto',
    'underscore',
    'backbone',
    'models/systemMessagesModel',
    'config'
], function ($, _, Backbone, SystemMessagesModel) {
    return Backbone.Collection.extend({
        /**
         * @field
         * @name SystemMessagesCollection#model
         * @type {SystemMessagesModel}
         */
        model: SystemMessagesModel,

        /**
         * @method
         * @name SystemMessagesCollection#parse
         * @returns {undefined}
         */
        parse: function(response){
            return response.results;
        },

        /**
         * @field
         * @name SystemMessagesCollection#url
         * @type {String}
         */
        url: Soshace.urls.api.systemMessages,

        /**
         * @constructor
         * @name SystemMessagesCollection#initialize
         * @returns {undefined}
         */
        initialize: function () {
        }
    });
});