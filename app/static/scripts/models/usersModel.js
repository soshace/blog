'use strict';

/**
 * Модель страницы пользователя
 *
 * @class UsersModel
 */

define([
    'zepto',
    'underscore',
    'backbone',
    'utils/helpers',
    'config'
], function ($, _, Backbone, Helpers) {
    return Backbone.Model.extend({

        /**
         * @field
         * @name UsersModel#idAttribute
         * @type {String}
         */
        idAttribute: '_id',

        /**
         * @method
         * @name UsersModel#initialize
         * @returns {string}
         */
        url: function () {
            var userName = this.get('userName');
            return Soshace.urls.api.user.replace('0', userName);
        },

        /**
         * @property
         * @name UsersModel#defaults
         * @type {Object}
         */
        defaults: {
            userName: null,
            locale: null,
            firstName: null,
            lastName: null,
            profileImg: null,
            sex: null,
            birthdayDate: null,
            birthdayMonth: null,
            birthdayFullYear: null,
            aboutAuthor: null
        },

        /**
         * Поля, которые отностятся к информации о профиле
         * По этим полям определятся заполненность профиля
         *
         * @field
         * @name UsersModel#profileInformationFields
         * @type {Array}
         */
        profileInformationFields: [
            'firstName',
            'lastName',
            'profileImg',
            'sex',
            'birthday',
            'aboutAuthor'
        ],

        /**
         * Список полов
         *
         * @field
         * @name UsersModel#sexList
         * @type {Array}
         */
        sexList: [
            {
                title: 'Male',
                value: 'male',
                selected: true
            },
            {
                title: 'Female',
                value: 'female',
                selected: false
            }
        ],

        /**
         * Метод возвращает true, если информация по прфилю пустая
         *
         * @method
         * @name UsersModel#isProfileInfoEmpty
         * @returns {Boolean}
         */
        isProfileInfoEmpty: function () {
            var profileInformationFields = this.profileInformationFields,
                fieldsLength = profileInformationFields.length,
                fieldName,
                i;

            for (i = 0; i < fieldsLength; i++) {
                fieldName = profileInformationFields[i];
                if (this.get(fieldName) !== null) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Метод загружает данные пользователя
         *
         * @method
         * @name UsersModel#getUser
         * @returns {jQuery.Deferred}
         */
        getUser: function () {
            var deferred = $.Deferred(),
                userName = this.get('userName'),
                profileUserName = '',
                profile = Soshace.profile;

            if (profile !== null) {
                profileUserName = profile.userName;

                if (profileUserName === userName) {
                    this.set(profile);
                    return deferred.resolve(profile);
                }
            }

            return this.fetch();
        },

        /**
         * Метод возвращает список полов с выбранным в модели полом
         *
         * @method
         * @name UsersModel#getSexList
         * @returns {Array}
         */
        getSexList: function () {
            var currentSex = this.get('sex');

            if (currentSex === null) {
                return this.sexList;
            }

            _.each(this.sexList, function (sex) {
                var isCurrentSex = sex.value === currentSex;
                sex.selected = isCurrentSex;
            });

            return this.sexList;
        },

        /**
         * @constructor
         * @name UsersModel#initialize
         * @returns {undefined}
         */
        initialize: function () {
            var locale = Helpers.getLocale();
            this.set({locale: locale}, {silent: true});
        }
    });
});