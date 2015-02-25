//TODO: разобраться почему mongoose прогоняет все валидаторы!
//TODO: Исправить валидацию!
'use strict';

/**
 * Модуль содержит набор валидаторов для моделей
 *
 * @module Validators
 */
module.exports = {
    /**
     * Метод проверяет на существование
     *
     * @method
     * @param {*} value
     * @name Validators.required
     * @returns {Boolean}
     */
    required: function (value) {
        if (value === '') {
            return false;
        }

        if (value === null) {
            return false;
        }

        if (typeof value === 'undefined') {
            return false;
        }

        if (typeof value === 'string') {
            return !(/^\s+$/.test(value));
        }

        return true;
    },

    /**
     * Метод проверки userName на уникальность
     *
     * @method
     * @name Validators.userNameUnique
     * @param {String} value значение
     * @param {Function} respond функция обратного вызова
     * @returns {undefined}
     */
    userNameUnique: function (value, respond) {
        this.model('users').getUserByUserName(value, function (error, user) {
            if (error || user) {
                respond(false);
                return;
            }
            respond(true);
        });
    },

    /**
     * Метод проверки email на уникальность
     *
     * @method
     * @name Validators.emailUnique
     * @param {String} value значение
     * @param {Function} respond функция обратного вызова
     * @returns {undefined}
     */
    emailUnique: function (value, respond) {
        this.model('users').getUserByEmail(value, function (error, user) {
            if (error || user) {
                respond(false);
                return;
            }
            respond(true);
        });
    },

    /**
     * Метод валидирует длину пароля не меньше 6 символов
     *
     * @method
     * @param {String} value
     * @name Validators.email
     * @returns {Boolean}
     */
    passwordMinLength: function(value){
        value = String(value);
        return value.length >= 6;
    }
};