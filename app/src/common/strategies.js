'use strict';

var _ = require('underscore'),
    Mongoose = require('mongoose'),
    ObjectId = Mongoose.Types.ObjectId,
    Passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    UsersModel = srcRequire('models/usersModel');

/**
 * Методы конфигурации стратегий
 */
var Strategies = {
    /**
     * Создаем идентификатор для новой сессии
     *
     * @function
     * @name Strategies.serializeUser
     * @param {Mongoose.Model} user
     * @param {Function} done
     * @return {undefined}
     */
    serializeUser: function (user, done) {
        done(null, user);
    },

    /**
     * Получаем данные сессии по идентификатору сессии из куки запроса
     *
     * @function
     * @name Strategies.deSerializeUser
     * @param {Mongoose.Model} user
     * @param {Function} done
     * @return {undefined}
     */
    deSerializeUser: function (user, done) {
        var userId = user._id;
        UsersModel.find({_id: new ObjectId(userId)}, function (error, user) {
            done(error, user);
        });
    },

    /**
     * Callback для конфигурации локальной стратегии
     *
     * @function
     * @name Strategies.local
     * @param {String} userEmail
     * @param {String} userPassword
     * @param {Function} done
     * @return {undefined}
     */
    local: function (userEmail, userPassword, done) {
        var emailError = UsersModel.validateEmail(userEmail);
        if (emailError) {
            done({email: emailError});
            return;
        }

        UsersModel.getUserByEmail(userEmail, _.bind(function (error, user) {
            this.getUserByEmailHandler(error, user, userEmail, userPassword, done);
        }, this));
    },

    /**
     * Метод обработчик получения пользователя по email внутри локальной стратегии
     *
     * @method
     * @name Strategies.getUserByEmailHandler
     * @param {*} error
     * @param {Object | null} user
     * @param {String} userEmail
     * @param {String} userPassword
     * @param {Function} done
     * @returns {undefined}
     */
    getUserByEmailHandler: function (error, user, userEmail, userPassword, done) {
        var passwordError;

        if (error) {
            done('Server is too busy, try later');
            return;
        }

        if (!user) {
            done({
                error: {
                    email: ['User with email {{email}} is not registered yet.', userEmail]
                },
                code: 400
            });
            return;
        }

        passwordError = UsersModel.validatePassword(userPassword);

        if (passwordError) {
            done({error: {password: passwordError}, code: 400});
            return;
        }

        user.comparePassword(userPassword, function (error) {
            if (error) {
                return done(error);
            }
            return done(null, user);
        });
    },

    /**
     * Конфигурирем утентификацию, используя локальнуб стратегию
     *
     * @method
     * @name Strategies.localStrategy
     * @returns {undefined}
     */
    localStrategy: function () {
        Passport.serializeUser(this.serializeUser);
        Passport.deserializeUser(this.deSerializeUser);

        //Конфигурируем утентификацию через форму логина
        Passport.use(new LocalStrategy({
            usernameField: 'email'
        }, this.local));
    }
};

_.bindAll(Strategies, 'serializeUser', 'deSerializeUser', 'local');
module.exports = Strategies;