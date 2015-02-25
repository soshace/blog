'use strict';

define([
    'zepto',
    'underscore',
    'backbone',
    'router',
    'utils/helpers',
    'collections/systemMessagesCollection',
    'views/headerView',
    'views/systemMessagesView',
    'jquery.cookie',
    'backbone.layoutmanager',
    'config',
    'deferred',
    'data'
], function ($, _, Backbone, Router, Helpers, SystemMessagesCollection, HeaderView, SystemMessagesView) {
    var App = Backbone.Layout.extend({

        /**
         * @field
         * @name App#router
         * @type {Router | null}
         */
        router: null,

        /**
         * Коллекция системных сообщений
         *
         * @field
         * @name App#systemMessagesCollection
         * @type {SystemMessagesCollection | null}
         */
        systemMessagesCollection: null,

        /**
         * @field
         * @name App#el
         * @type {String}
         */
        el: 'body',

        /**
         * Список ссылкок на элемнты DOM
         *
         * @field
         * @name App#elements
         * @type {Object}
         */
        elements: {
            title: null,
            contentFirstLoad: null
        },

        /**
         * @constructor
         * @name App#initialize
         * @returns {undefined}
         */
        initialize: function () {
            _.bindAll(this, 'routerLinkHandler', 'initializeCompleted');
            this.systemMessagesCollection = new SystemMessagesCollection();
            this.getCommonData().done(this.initializeCompleted);
        },

        /**
         * Метод вовзращает true, если есть профиль
         * аутентифицированного пользователя
         *
         * @method
         * @name App#isAuthenticated
         * @returns {Boolean}
         */
        isAuthenticated: function () {
            return $.cookie('isAuthenticated') === '1';
        },

        /**
         * Метод обработчик заврешения инициализации приложения
         * Когда загружается все необходимы польховательские данные
         *
         * @method
         * @name App#initializeCompleted
         * @returns {undefined}
         */
        initializeCompleted: function () {
            var _this = this;

            this.setElements();
            this.setView('.js-header', new HeaderView());
            this.setView('.js-system-messages', new SystemMessagesView({
                collection: _this.systemMessagesCollection
            }));
            this.$el.on('click', '.js-router-link', this.routerLinkHandler);
            this.router = new Router();
        },

        /**
         * Метод получает все необходимые данные для запуска
         * приложения
         *
         * Такие как: локали, данные профиля пользователя
         *
         * @method
         * @name App#getCommonData
         * @returns {jQuery.Deferred}
         */
        getCommonData: function () {
            return $.when(
                this.getCurrentLocale(),
                this.getProfileData(),
                this.getSystemMessages()
            );
        },

        /**
         * Метод сохраняет в поле elements ссылки на
         * элементы DOM
         *
         * @method
         * @name App#setElements
         * @returns {undefined}
         */
        setElements: function () {
            this.elements.title = $('title');
            this.elements.contentFirstLoad = $('.js-content-first-load');
        },

        /**
         * Метод обработчик клика на ссылки предназначенные для
         * роутера
         *
         * @method
         * @name App#routerLinkHandler
         * @param {jQuery.Event} event
         * @returns {undefined}
         */
        routerLinkHandler: function (event) {
            var $target = $(event.target),
                link = $target.closest('.js-router-link').attr('href');

            if (Helpers.checkHistoryApiSupport()) {
                event.preventDefault();
                Backbone.history.navigate(link, {trigger: true});
            }
        },

        /**
         * Метод получает системные сообщения
         *
         * @method
         * @name App#getSystemMessages
         * @returns {undefined}
         */
        getSystemMessages: function () {
            return this.systemMessagesCollection.fetch();
        },

        /**
         * Метод получает данные профиля пользователя
         *
         * Возвращает деферред объект
         *
         * @method
         * @name App#getProfileData
         * @returns {jQuery.Deferred}
         */
        getProfileData: function (profileUserName) {
            var profileUrl,
                deferred = $.Deferred();

            if (!this.isAuthenticated()) {
                return deferred.resolve(null);
            }

            if (Soshace.profile !== null) {
                return deferred.resolve(Soshace.profile);
            }

            profileUserName = $.cookie('profileUserName');
            profileUrl = Soshace.urls.api.user.replace('0', profileUserName);
            $.get(profileUrl, function (data) {
                Soshace.profile = data;
                deferred.resolve(data);
            }, 'json');

            return deferred;
        },

        /**
         * Метод получает файлы перевода и записывает
         * в глобальную переменную Soshace.
         *
         * @method
         * @name App#getCurrentLocale
         * @returns {deferred}
         */
        getCurrentLocale: function () {
            var deferred = $.Deferred(),
                locale = Helpers.getLocale(),
                locales = Soshace.locales,
                localeUrl = Soshace.urls.locales + locale + '.json';

            if (locale === 'en') {
                return deferred.resolve({});
            }

            if (typeof locales[locale] !== 'undefined') {
                return deferred.resolve(locales[locale]);
            }

            $.get(localeUrl, function (data) {
                locales[locale] = data;
                deferred.resolve(data);
            }, 'json');

            return deferred;
        }
    });

    Soshace.app = new App();
});



