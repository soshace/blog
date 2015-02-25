'use strict';

var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema,
    ObjectId = Schema.ObjectId,

    /**
     * Класс для работы с моделью сообщений
     * ревью
     *
     * @class
     * @name ReviewCommentsShema
     * @type {Schema}
     */
    ReviewCommentsShema = new Schema({
        //id пользователя, к которому относится сообщение
        ownerId: {
            type: ObjectId,
            default: null
        },
        locale: {
            default: 'en',
            type: String
        },
        //Загловок сообщения
        title: {
            type: String
        },
        //Опубликовано, отправлено и т.д.
        status: {
            type: String
        },
        //Тело поста
        body: {
            type: String
        }
    });

module.exports = Mongoose.model('posts', ReviewCommentsShema);