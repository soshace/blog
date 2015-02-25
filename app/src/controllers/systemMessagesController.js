'use strict';

var _ = require('underscore'),
    Mongoose = require('mongoose'),
    ObjectId = Mongoose.Types.ObjectId,
    Controller = srcRequire('common/controller'),
    RequestParams = srcRequire('common/requestParams'),
    SystemMessagesModel = srcRequire('models/systemMessagesModel');

/**
 * Контроллер, отвечающий за работу с системными сообщениями
 *
 * @class SystemMessagesController
 *
 */
module.exports = Controller.extend({
    /**
     * Метод отправляет сообщения для незарегистрированных пользователей
     *
     * @method
     * @name SystemMessagesController#sendCommonMessages
     * @returns {undefined}
     */
    sendCommonMessages: function () {
        var response = this.response;

        SystemMessagesModel.getMessages({notAuthenticated: true}, _.bind(function (error, messages) {
            if (error) {
                this.sendError(error);
                return;
            }

            response.send({results: messages});
        }, this));
    },

    /**
     * Метод возврвщает все системные сообщения для
     * профиля пользователя
     *
     * @method
     * @name SystemMessagesController#getMessages
     * @returns {undefined}
     */
    getMessages: function () {
        var request = this.request,
            response = this.response,
            requestParams = new RequestParams(request),
            isAuthenticated = requestParams.isAuthenticated,
            profile = requestParams.profile;

        if (!isAuthenticated) {
            this.sendCommonMessages();
            return;
        }

        SystemMessagesModel.getMessages({ownerId: profile._id}, function (error, messages) {
            if (error) {
                response.sendError(error);
                return;
            }

            response.send({results: messages});
        });
    },

    /**
     * Метод удаляет сообщение по алиасу,
     * относящееся к профилю пользователя
     *
     * @method
     * @name SystemMessagesController#removeMessage
     * @returns {undefined}
     */
    removeMessage: function () {
        var request = this.request,
            response = this.response,
            params = request.params,
            _id = params._id,
            requestParams = new RequestParams(request),
            isAuthenticated = requestParams.isAuthenticated,
            profile = requestParams.profile;

        if (!isAuthenticated) {
            this.sendError('User is not authorized', 401);
            return;
        }

        SystemMessagesModel.safeRemoveMessage({
            _id: new ObjectId(_id),
            //нужно уточнение владельца сообщения
            ownerId: new ObjectId(profile._id)
        }, _.bind(function (error, messages) {
            if (error) {
                this.sendError(error);
                return;
            }

            response.send({results: messages});
        }, this));
    },

    /**
     * @method
     * @name SystemMessagesController#updateMessage
     * @returns {undefined}
     */
    updateMessage: function () {

    }
});