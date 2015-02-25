'use strict';

var _ = require('underscore'),
    Controller = srcRequire('common/controller'),
    UsersModel = srcRequire('models/usersModel'),
    RequestParams = srcRequire('common/requestParams');

/**
 * Controller of remind password page
 *
 * @class RemindPasswordController
 */
module.exports = Controller.extend({
    /**
     * Method renders remind password page
     *
     * @public
     * @function
     * @name RemindPasswordController#renderRemindPasswordPage
     * @return {undefined}
     */
    renderRemindPasswordPage: function () {
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

        response.render('auth/remindPassword', _.extend(requestParams, {
            title: 'Remind password page'
        }));
    },

    /**
     * Method validates email field
     *
     * @method
     * @name RemindPasswordController#validateField
     * @param {string} fieldValue
     * @param {Function} callback
     * @returns {undefined}
     */
    validateField: function (fieldValue, callback) {
        var user = new UsersModel({
            email: fieldValue
        });

        user.validate(_.bind(function (error) {
            var errors = error && error.errors,
                errorMessage = errors && errors['email'] || null;

            if (errorMessage) {
                callback(errorMessage);
                return;
            }

            callback(null);
        }, this));
    },

    /**
     * Method handles request with email for password repairing
     *
     * @public
     * @method
     * @name RemindPasswordController#remindPasswordHandler
     * @returns {undefined}
     */
    remindPasswordHandler: function () {
        var request = this.request,
            requestBody = request.body,
            emailValue = requestBody.email;

        this.validateField(emailValue, function(error){
            console.log(error);
        });
    }
});