'use strict';

/**
 * Вид страницы списка постов
 *
 * @module HeaderView
 */

define([
    'zepto',
    'underscore',
    'backbone',
    'utils/helpers',
    'jquery.cookie',
    'backbone.layoutmanager',
    'templates'
], function ($, _, Backbone, Helpers) {
    return Backbone.Layout.extend({
        /**
         * @field
         * @name HeaderView#elements
         * @type {Object}
         */
        elements: {
        },

        /**
         * @field
         * @name HeaderView#tabsConfig
         * @type {Object}
         */
        tabsConfig: {
            isHomeTab: false,
            isPostEditTab: false,
            isAuthTab: false,
            isUserTab: false
        },

        /**
         * Соотношение алиаса страницы и названия таба
         *
         * @field
         * @name HeaderView#pageAliasToTab
         * @type {Object}
         */
        pageAliasToTab: {
            home: 'isHomeTab',
            login: 'isAuthTab',
            registration: 'isAuthTab',
            postEdit: 'isPostEditTab',
            user: 'isUserTab',
            userEdit: 'isUserTab',
            userSettings: 'isUserTab'
        },

        /**
         * Список обработчиков событий
         *
         * @field
         * @name HeaderView#events
         * @type {Object}
         */
        events: {
            'click .js-logout': 'logout'
        },

        /**
         * Путь до шаблона
         *
         * @field
         * @name HeaderView#elements
         * @type {string}
         */
        template: Soshace.hbs['partials/header'],

        /**
         * @constructor
         * @name HeaderView#initialize
         * @returns {undefined}
         */
        initialize: function () {
        },

        /**
         * Обработчик клика по кнопке 'Выход'
         *
         * @method
         * @name HeaderView#logout
         * @param {jQuery.Event} event
         * @returns {undefined}
         */
        logout: function(event){
            event.preventDefault();
            $.get(Soshace.urls.api.logout).done(_.bind(function () {
                this.logoutHandler();
            }, this));
        },

        /**
         * Метод обработчик выхода пользователя
         *
         * @method
         * @name HeaderView#logoutHandler
         * @returns {undefined}
         */
        logoutHandler: function () {
            var app = Soshace.app;

            Soshace.profile = null;
            app.getView('.js-system-messages').collection.fetch().
                done(this.logoutDoneHandler);
        },

        /**
         * Метод обработчик выхода пользователя после получения
         * списка системных сообщений
         *
         * @method
         * @name HeaderView#logoutDoneHandler
         * @returns {undefined}
         */
        logoutDoneHandler: function () {
            var app = Soshace.app,
                locale = Helpers.getLocale(),
                routeParams,
                currentController;

            if(Soshace.pageAlias === 'home'){
                currentController = app.router.currentController;
                routeParams = currentController.routeParams;
                currentController.routeHandler.apply(currentController, routeParams);
                return;
            }
            Backbone.history.navigate('/' + locale, {trigger: true});
        },

        /**
         * Метод смены таба
         *
         * @method
         * @name HeaderView#changeTab
         * @param {string} [pageAlias] алиас страницы
         * @returns {undefined}
         */
        changeTab: function (pageAlias) {
            var tabName = pageAlias && this.pageAliasToTab[pageAlias],
                tabConfig = this.tabsConfig;

            _.each(tabConfig, function (value, tab) {
                tabConfig[tab] = false;
            });

            if (tabName && typeof tabConfig[tabName] !== 'undefined') {
                tabConfig[tabName] = true;
            }
            this.render();
        },

        /**
         * @method
         * @name HeaderView#serialize
         * @returns {Object}
         */
        serialize: function () {
            var app = Soshace.app,
                data = {};
            
            data = _.extend(data, this.tabsConfig);
            data.locale = Helpers.getLocale();
            data.isAuthenticated = app.isAuthenticated();
            data.paths = Soshace.urls;
            if (data.isAuthenticated) {
                data.profileUserName = Soshace.profile.userName;
            }
            return data;
        },

        /**
         * @method
         * @name HeaderView#afterRender
         * @returns {undefined}
         */
        afterRender: function () {
        }
    });
});