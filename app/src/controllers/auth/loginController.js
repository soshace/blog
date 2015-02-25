'use strict';
var _ = require('underscore'),
    Controller = srcRequire('common/controller'),
    RequestParams = srcRequire('common/requestParams'),
    Passport = require('passport');

/**
 * Контроллер страницы регистрации
 *
 * @class LoginController
 */
module.exports = Controller.extend({

    /**
     * @constructor
     * @name LoginController#initialize
     * @param {Object} request объект запроса
     * @param {Object} response Объект ответа
     * @returns {undefined}
     */
    initialize: function (request, response) {
        this.request = request;
        this.response = response;
        _.bindAll(this,
            'authenticateHandler',
            'userLogin'
        );
    },

    /**
     * Рендерим страницу регистрации
     *
     * @method
     * @name LoginController#renderLogin
     * @return {undefined}
     */
    renderLogin: function () {
        var request = this.request,
            response = this.response,
            requestParams = new RequestParams(request),
            locale,
            profileUserName;

        if (requestParams.isAuthenticated) {
            locale = requestParams.locale;
            profileUserName = requestParams.profileUserName;
            response.redirect('/' + locale + '/users/' + profileUserName);
            return;
        }

        response.render('auth/auth', _.extend(requestParams, {
            isAuthTab: true,
            isLoginTab: true,
            title: 'Login page'
        }));
    },

    /**
     * Обработчик запроса аворизации со страницы логина
     *
     * @method
     * @name LoginController#loginHandler
     * @return {undefined}
     */
    loginHandler: function () {
        var request = this.request,
            response = this.response,
            next = this.next;

        Passport.authenticate('local', this.authenticateHandler)(request, response, next);
    },

    /**
     * Обработчик запроса выхода из сессии
     *
     * @method
     * @name LoginController#logoutHandler
     * @return {undefined}
     */
    logoutHandler: function () {
        var request = this.request,
            response = this.response;

        request.logout();
        response.clearCookie('isAuthenticated');
        response.clearCookie('profileUserName');
        response.send({isAuthenticated: false});
    },

    /**
     * @method
     * @name LoginController#authenticateHandler
     * @param {*} error
     * @param {Mongoose.Model} user
     * @returns {undefined}
     */
    authenticateHandler: function (error, user) {
        var request = this.request;

        if (typeof error === 'string') {
            return this.sendError(error, 500);
        }

        if (error) {
            return this.sendError(error);
        }

        request.login(user, _.bind(function (error) {
            this.userLogin(error, user);
        }, this));
    },

    /**
     * @method
     * @name LoginController.userLogin
     * @param {Object} error
     * @param {Mongoose.Model} user
     * @returns {undefined}
     */
    userLogin: function (error, user) {
        var response = this.response;

        if (error) {
            return this.sendError('Server is too busy, try later', 503);
        }

        response.cookie('isAuthenticated', '1');
        response.cookie('profileUserName', user.userName);
        user = user.getProfileFields();
        response.send(user);
    }
});