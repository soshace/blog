'use strict';

var _ = require('underscore'),
    RequestParams = srcRequire('common/requestParams'),
    Class = srcRequire('vendors/class');

/**
 * Родительский класс для контороллеров
 *
 * @class ControllerInit
 */
module.exports = Class.extend({

    /**
     * @field
     * @name ControllerInit#next
     * @type {Function | null}
     */
    next: null,

    /**
     * Объект ответа
     *
     * @field
     * @name ControllerInit#response
     * @type {Object | null}
     */
    response: null,

    /**
     * Объект запроса
     *
     * @field
     * @name ControllerInit#request
     * @type {Object | null}
     */
    request: null,

    /**
     * @constructor
     * @name ControllerInit#initialize
     * @param {Object} request объект запроса
     * @param {Object} response Объект ответа
     * @param {Function} next
     * @returns {undefined}
     */
    initialize: function (request, response, next) {
        this.request = request;
        this.response = response;
        this.next = next;
    },


    /**
     * Метод отправляет сообщение с ошибкой
     * Текст ошибки передается в параметре
     *
     * @method
     * @name ControllerInit#sendError
     * @param {Object | String} error  Пример: {error: 'Ошибка', code: 400} или 'Ошибка'
     * @param {String} [code] код ошибки, 404, 500 по-умолчанию 400
     * @returns {undefined}
     */
    sendError: function (error, code) {
        var response = this.response,
            errorCode = 400,
            errorMessage = 'Bad request.';

        if (typeof error === 'object' && error !== null) {
            errorMessage = error.error || errorMessage;
            errorCode = error.code || errorCode;
        } else {
            errorMessage = error || errorMessage;
            errorCode = code || errorCode;
        }

        response.status(errorCode).send({
            error: errorMessage
        });
    },

    /**
     * @method
     * @name ControllerInit#renderError
     * @param {Object | String} error  Пример: {error: 'Ошибка', code: 400} или 'Ошибка'
     * @param {String} [code] код ошибки, 404, 500 по-умолчанию 400
     * @returns {undefined}
     */
    renderError: function (error, code) {
        var response = this.response,
            request = this.request,
            requestParams = new RequestParams(request),
            errorCode = 400,
            errorMessage = 'Bad request.';

        if (typeof error === 'object') {
            errorMessage = error.error || errorMessage;
            errorCode = error.code || errorCode;
        } else {
            errorMessage = error || errorMessage;
            errorCode = code || errorCode;
        }

        response.status(errorCode).render('error', _.extend(requestParams, {
            error: errorMessage,
            code: errorCode
        }));
    },

    /**
     * Метод отправляет успешное сообщение
     * Текст сообщения передается в параметре
     *
     * @method
     * @name ControllerInit#sendSuccess
     * @param {String} message
     *                               сообщение
     * @returns {undefined}
     */
    sendSuccess: function (message) {
        var response = this.response;

        response.send({
            error: null,
            message: message
        });
    }
});