//TODO: доделать валидацию, добавить trim
'use strict';

var _ = require('underscore'),
    Mongoose = require('mongoose'),
    Schema = Mongoose.Schema,
    ObjectId = Schema.ObjectId,

    /**
     * Класс для работы с моделью постов
     *
     * @class
     * @name PostsShema
     * @type {Schema}
     */
        PostsShema = new Schema({
        //Время последнего изменения
        updated: {
            type: Date,
            default: null,
            readOnly: true
        },
        //Время публикации
        published: {
            type: Date,
            default: null,
            readOnly: true
        },
        //id пользователя, к которому относится сообщение
        ownerId: {
            type: ObjectId,
            default: null,
            //поле не может быть изменено пользователем
            readOnly: true
        },
        locale: {
            default: 'en',
            type: String
        },
        //Загловок поста
        title: {
            type: String,
            default: null
        },
        category: {
            type: String,
            default: null
        },
        //Тэги для подбора
        tags: {
            type: Array,
            default: null
        },
        //Опубликовано, отправлено и т.д.
//        sent,
//        published,
//        denied,
//        comments
        status: {
            type: String,
            default: null
        },
        //Описание для выдачи
        description: {
            type: String,
            default: null
        },
        //Тело поста
        body: {
            type: String,
            default: null
        }
    });

/**
 * TODO: у статьи могут быть картинки, тогда описание
 * полуится слишком большм, поэтому надо по <readmore/>
 * Который будет ставиться на клиенте
 *
 * Формируем описание поста из тела поста
 *
 * @method
 * @name getPostDescription
 * @param {String} postBody тело поста
 * @returns {*}
 */
function getPostDescription(postBody) {
    var readMorePosition = postBody.indexOf('<readmore/>');

    if (readMorePosition === -1) {
        return postBody;
    }

    return postBody.substr(0, readMorePosition);
}

/**
 * Метод проверяет сооветствие пришедшего типа
 * значения поля типу установленому в модели
 *
 * @method
 * @name checkFieldType
 * @param {String} field
 * @param {*} value
 * @returns {boolean} вовращает true, если поле соответствует типу в модели
 */
function checkFieldType(field, value) {
    var postPaths = PostsShema.paths,
        fieldSetting = postPaths[field].options;

    if (value === null) {
        return true;
    }

    if (fieldSetting.type === String) {
        return typeof value === 'string';
    }

    if (fieldSetting.type === Array) {
        return value instanceof Array;
    }

    return true;
}

/**
 * Оставляем в модели только необходимые данные
 */
PostsShema.pre('save', function (next) {
    var postPaths = PostsShema.paths;

    _.each(this, _.bind(function (value, field) {
        if (typeof postPaths[field] === 'undefined') {
            return;
        }

        if (!checkFieldType(field, value)) {
            this[field] = undefined;
        }
    }, this));
    next();
});

/**
 * Добавляем описание и время обновления
 */
PostsShema.pre('save', function (next) {
    var postBody = this.body;

    if (postBody) {
        this.description = getPostDescription(postBody);
    }

    this.status = 'saved';
    this.updated = new Date();
    next();
});

/**
 * Получаем список постов
 *
 * @method
 * @name PostsShema.getPosts
 * @param {String} locale
 * @param {Function} callback
 * @return {Cursor}
 */
PostsShema.statics.getPosts = function (locale, callback) {
    return this.find({
        'locale': locale,
        status: 'published'
    }, {
        _id: 1,
        title: 1,
        description: 1,
        locale: 1,
        status: 1,
        ownerId: 1
    }).exec(function (error, posts) {
            if (error) {
                callback({error: 'Server is too busy, try later.', code: 503});
                return;
            }

            callback(null, posts);
        });
};

/**
 * Получаем список постов со статусом sent
 * Статьи, которые были отправлены на публикацию
 *
 * @method
 * @name PostsShema.getStatusSentPosts
 * @param {String} locale локаль
 * @param {Function} callback
 * @return {undefined}
 */
PostsShema.statics.getStatusSentPosts = function (locale, callback) {
    this.find({
        'locale': locale,
        'status': 'sent'
    }, {
        _id: 1,
        title: 1,
        description: 1,
        locale: 1,
        status: 1,
        ownerId: 1
    }).
        sort({updated: -1}).
        exec(function (error, posts) {
            if (error) {
                callback({error: 'Server is too busy, try later.', code: 503});
                return;
            }

            callback(null, posts);
        });
};

/**
 * Метод проверяет обновляемые поля модели на соответствие типу
 *
 * @method
 * @name PostsShema.isUpdateFieldsValid
 * @param {Object} update обновляемые данные
 * @returns {Boolean} false - ошибка
 */
PostsShema.statics.isUpdateFieldsValid = function (update) {
    var isValid = true;

    _.every(update, function (value, field) {
        isValid = checkFieldType(field, value);
        return isValid;
    });

    return isValid;
};

/**
 * Метод удляет все поля из запроса не соответствующие
 * полям модели и имеющие флаг readOnly
 *
 * @method
 * @name PostsShema.clearUpdate
 * @param {Object} update обновляемые данные
 * @returns {Object} очищенный объект обновления
 */
PostsShema.statics.clearUpdate = function (update) {
    var clearUpdate = {},
        userPaths = PostsShema.paths;

    _.each(update, function (value, fieldName) {
        var modelField = userPaths[fieldName],
            fieldSettings;

        if (_.isUndefined(modelField)) {
            return;
        }

        fieldSettings = modelField.options;

        if (fieldSettings.readOnly) {
            return;
        }

        clearUpdate[fieldName] = value;
    });

    return clearUpdate;
};

/**
 * TODO: статью в статусе published может патчить только админ
 *
 * Метод обновляет статью
 *
 * @method
 * @name PostsShema.updatePost
 * @param {String} postId id статьи
 * @param {Mongoose.model} profile профиль пользователя
 * @param {Object} update обновляемые поля
 * @param {Function} callback
 * @return {undefined}
 */
PostsShema.statics.updatePost = function (postId, profile, update, callback) {
    var error,
        updateRequest,
        profileId,
        status;

    if (typeof update !== 'object') {
        callback({error: 'Bad Request', code: 400});
        return;
    }

    //Очиска объекта обновления от полей, не входящих в модель
    update = this.clearUpdate(update);
    status = update.status;

    //Проверка на права пользователя обновлять статьи с данным статусом
    if (typeof status !== 'undefined') {
        error = this.checkUpdateStatus(postId, profile, status, callback);
        if (error) {
            callback(error);
            return;
        }
    }

    //Проверка соответствия типам полей
    if (!this.isUpdateFieldsValid(update)) {
        callback({error: 'Bad Request', code: 400});
        return;
    }

    //Получение описания
    if (update.body) {
        update.description = getPostDescription(update.body);
    }

    update.updated = new Date();
    profileId = profile._id;
    updateRequest = {
        _id: postId,
        ownerId: profileId
    };

    this.update(updateRequest, {$set: update}, _.bind(function (error, updated) {
        this.updatePostHandler(error, updated, callback);
    }, this));
};

/**
 * Метод обработчик обновления статьи в базе
 *
 * @method
 * @name PostsShema.updatePostHandler
 * @param {Object} error ошибка
 * @param {Number} updated флаг, означающий, что статья была обновлена
 * @param {Function} callback
 * @returns {undefined}
 */
PostsShema.statics.updatePostHandler = function (error, updated, callback) {
    if (error) {
        callback({error: 'Server is too busy, try later.', code: 503});
        return;
    }

    if (updated !== 1) {
        callback({error: 'Bad request.', code: 400});
        return;
    }

    callback(null);
};

/**
 * Метод обновляет статус статьи
 *
 * @method
 * @name PostsShema.checkUpdateStatus
 * @param {Mongoose.model} profile профиль пользователя
 * @param {String} status пришедший статус статьи
 * @return {Object | null} ошибка доступа
 */
PostsShema.statics.checkUpdateStatus = function (profile, status) {
    var isAdmin = profile.admin,
        adminStatuses = ['sent', 'published', 'denied', 'comments'],
        isAdminStatus = adminStatuses.indexOf(status) !== -1;

    if (isAdminStatus && !isAdmin) {
        return {error: 'Forbidden ', code: 403};
    }

    return null;
};

/**
 * Метод получает статью по id,
 * которую может редактировать пользователь
 *
 * @method
 * @name PostsShema.getProfilePost
 * @param {String} postId id статьи
 * @param {String} ownerId id пользователя
 * @param {Function} callback
 * @return {undefined}
 */
PostsShema.statics.getProfilePost = function (postId, ownerId, callback) {
    this.findOne({
            _id: postId,
            ownerId: ownerId
        },
        {
            _id: 1,
            title: 1,
            body: 1,
            locale: 1,
            status: 1,
            ownerId: 1
        }).exec(function (error, post) {
            if (error) {
                callback({error: 'Server is too busy, try later.', code: 503});
                return;
            }

            callback(null, post);
        });
};

/**
 * Метод получает список статей для конретного пользователя
 * Получает все статьи для зарегистрированного пользователя
 *
 * @method
 * @name PostsShema.getProfilePosts
 * @param {String} ownerId id пользователя
 * @param {Function} callback
 * @return {undefined}
 */
PostsShema.statics.getProfilePosts = function (ownerId, callback) {
    this.find({ownerId: ownerId}, {
        _id: 1,
        title: 1,
        description: 1,
        locale: 1,
        status: 1,
        ownerId: 1
    }).
        sort({updated: -1}).
        exec(function (error, posts) {
            if (error) {
                callback({error: 'Server is too busy, try later.', code: 503});
                return;
            }

            callback(null, posts);
        });
};

/**
 * Метод получает список статей для конретного пользователя,
 * доступные для всех (status: 'published')
 *
 * @method
 * @name PostsShema.getUserPosts
 * @param {String} ownerId id пользователя
 * @param {Function} callback
 * @return {undefined}
 */
PostsShema.statics.getUserPosts = function (ownerId, callback) {
    this.find({
        ownerId: ownerId,
        status: 'published'
    }, {
        _id: 1,
        title: 1,
        description: 1,
        locale: 1,
        status: 1,
        ownerId: 1
    }).exec(function (error, posts) {
            if (error) {
                callback({error: 'Server is too busy, try later.', code: 503});
                return;
            }

            callback(null, posts);
        });
};

/**
 * Метод получает статью целиком
 *
 * @method
 * @name PostsShema.getPost
 * @param {String} postId id статьи
 * @param {Function} callback
 * @return {undefined}
 */
PostsShema.statics.getPost = function (postId, callback) {
    this.findOne({_id: postId}, {
        _id: 1,
        title: 1,
        body: 1,
        locale: 1,
        status: 1,
        ownerId: 1
    }).exec(function (error, post) {
            if (error) {
                callback({error: 'Server is too busy, try later.', code: 503});
                return;
            }

            callback(null, post);
        });
};

/**
 * Метод удаляет статью по id
 *
 * @method
 * @name PostsShema.removePost
 * @param {Object} postId id удаляемой статьи
 * @param {Function} callback
 * @return {undefined}
 */
PostsShema.statics.removePost = function (postId, callback) {
    this.findOneAndRemove({_id: postId}, null, function (error) {
        if (error) {
            callback({error: 'Server is too busy, try later.', code: 503});
            return;
        }

        callback(null);
    });
};

module.exports = Mongoose.model('posts', PostsShema);