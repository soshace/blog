'use strict';

var Controller = srcRequire('common/controller'),
    Fs = require('fs'),
    Formidable = require('formidable'),
    Crypto = require('crypto'),
    _ = require('underscore'),
    gm = require('gm').subClass({ imageMagick: true });

/**
 * Контроллер, отвечающий за загрузку изображений
 *
 * @class ImageController
 *
 */
module.exports = Controller.extend({

    /**
     * Формат изображений, в котором мы записываем их на диск
     *
     * @field
     * @name ImageController#outputFormat
     * @type {String}
     */
    outputFormat: 'jpg',

    /**
     * Максимальная ширина изображения
     *
     * @field
     * @name ImageController#imageMaxWidth
     * @type {String}
     */
    imageMaxWidth: '1170',

    /**
     * Максимальная высота изображения
     *
     * @field
     * @name ImageController#imageMaxHeight
     * @type {String}
     */
    imageMaxHeight: '800',

    /**
     * Метод возвращает будущий адрес картинки на диске
     *
     * @method
     * @name ImageController#getUniqueImageName
     * @param {string | Buffer} imageData тело картинки
     * @returns {Object} возвращает объект, содержащий
     *                   внешний и локальный путь до картинки
     */
    getImagePath: function (imageData) {
        var md5sum = Crypto.createHash('md5'),
            newImageName,
            webImgUrl,
            localImagePath;

        md5sum.update(imageData);
        newImageName = md5sum.digest('hex') + '.' + this.outputFormat;
        webImgUrl = '/media/' + newImageName;
        localImagePath = Soshace.MEDIA_DIRECTORY() + newImageName;

        return {
            webImgUrl: webImgUrl,
            localImagePath: localImagePath
        };
    },

    /**
     * Метод обработчик загрузки изображения
     *
     * @method
     * @name ImageController#createImage
     * @returns {undefined}
     */
    createImage: function () {
        var request = this.request,
            form = new Formidable.IncomingForm();

        form.parse(request, _.bind(this.readImage, this));
    },

    /**
     * Метод считывает данные пришедшего изображения
     * и отправляет картинку на запись
     *
     * @method
     * @name ImageController#readImage
     * @param {Object} error Ошибка
     * @param {Object} fields список полей
     * @param {Object} files список файлов
     * @returns {undefined}
     */
    readImage: function (error, fields, files) {
        var imageParams = files.image,
            imagePath = imageParams.path,
            imageName = imageParams.name;

        if (error) {
            this.sendError('Server is too busy, try later', 503);
            return;
        }

        Fs.readFile(imagePath, _.bind(function (error, imageData) {
            this.saveImage(error, imageData, imageName);
        }, this));
    },

    /**
     * Метод записывает изображение на диск
     *
     * @method
     * @name ImageController#saveImage
     * @param {Object} error Ошибка
     * @param {Object} imageData Содержимое изображения
     * @param {String} imageName Название картинки
     * @returns {undefined}
     */
    saveImage: function (error, imageData, imageName) {
        if (error) {
            this.sendError('Server is too busy, try later', 503);
            return;
        }

        var response = this.response,
            imagePathData = this.getImagePath(imageData),
            imageUrl = imagePathData.webImgUrl,
            localPath = imagePathData.localImagePath;

        gm(imageData, imageName).
            setFormat(this.outputFormat).
            resize(this.imageMaxWidth, this.imageMaxHeight, '>').
            write(localPath, _.bind(function (error) {
                if (error) {
                    this.sendError('Server is too busy, try later', 503);
                    return;
                }

                response.send({
                    error: null,
                    path: imageUrl
                });
            }, this));
    }
});