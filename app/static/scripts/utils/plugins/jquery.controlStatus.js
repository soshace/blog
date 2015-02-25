/**
 * Плагин для показа ошибок, подсказок у полей и
 * отображения успешных полей
 */

'use strict';

define([
    'zepto',
    'underscore'
], function ($, _) {
    var methods = {
        /**
         * @constructor
         * @name jQuery.fn.controlStatus#initialize
         * @param {Object} [options]
         *                  options.helperTitle - текст подсказки для поля
         *                  options.successTitle - текст сообщения для
         *                  успешного поля
         * @returns {jQuery}
         */
        initialize: function (options) {
            return this.each(function () {
                var $this = $(this),
                    $formGroup = $this.parent(),
                    controlOptions = options || {};

                $this.data('controlStatus', controlOptions);
                $formGroup.addClass('has-feedback');
                $formGroup.append($('<span>', {
                    'class': 'form-control-feedback'
                }));
                $formGroup.append($('<div>', {
                    'class': 'form-group-status hide'
                }));
            });
        },

        /**
         * Метод показывает тултип подсказки у поля
         *
         * @public
         * @method
         * @name jQuery.fn.controlStatus#helper
         * @returns {jQuery}
         */
        helper: function () {
            return this.each(function () {
                var $this = $(this),
                    controlStatusData = $this.data('controlStatus'),
                    $formGroup = $this.parent(),
                    $groupStatus = $('.form-group-status', $formGroup);

                $formGroup.removeClass('has-error');
                $formGroup.removeClass('has-success');
                $groupStatus.html(controlStatusData.helperTitle);

                if (!controlStatusData.helperIsShowing) {
                    $groupStatus.removeClass('hide');
                }

                $this.data('controlStatus', _.extend(controlStatusData, {
                    helperIsShowing: true,
                    status: 'helper'
                }));
            });
        },

        /**
         * Метод скрывает тултипы подсказки у поля
         *
         * @public
         * @method
         * @name jQuery.fn.controlStatus#hideHelper
         * @returns {jQuery}
         */
        hideHelper: function () {
            return this.each(function () {
                var $this = $(this),
                    controlStatusData = $this.data('controlStatus');

                if (!(controlStatusData && controlStatusData.helperIsShowing)) {
                    return;
                }

                $this.data('controlStatus', _.extend(controlStatusData, {
                    helperIsShowing: false
                }));

                $this.siblings('.form-group-status').addClass('hide');
            });
        },

        /**
         * Метод отображает ошибку у поля
         *
         * @public
         * @method
         * @name jQuery.fn.controlStatus#error
         * @param {String} error текст ошибки
         * @returns {jQuery}
         */
        error: function (error) {
            return this.each(function () {
                var $this = $(this),
                    controlStatusData = $this.data('controlStatus') || {},
                    $formGroup = $this.parent(),
                    $groupStatus = $('.form-group-status', $formGroup);

                $formGroup.removeClass('has-success');
                $formGroup.addClass('has-error');
                $groupStatus.html(error);

                if (!(controlStatusData.helperIsShowing)) {
                    $groupStatus.removeClass('hide');
                }

                $this.data('controlStatus', _.extend(controlStatusData, {
                    helperIsShowing: true,
                    status: 'error'
                }));
            });
        },

        /**
         * Метод устаналивает поле в состояние успех
         *
         * @public
         * @method
         * @name jQuery.fn.controlStatus#success
         * @returns {jQuery}
         */
        success: function () {
            return this.each(function () {
                var $this = $(this),
                    controlStatusData = $this.data('controlStatus'),
                    $formGroup = $this.parent(),
                    $groupStatus = $('.form-group-status', $formGroup);

                $formGroup.removeClass('has-error');
                $formGroup.addClass('has-success');
                $groupStatus.html(controlStatusData.successTitle);

                if (!(controlStatusData && controlStatusData.helperIsShowing)) {
                    $groupStatus.removeClass('hide');
                }

                $this.data('controlStatus', _.extend(controlStatusData, {
                    status: 'success'
                }));
            });
        },

        /**
         * Метод устанавливает поле в дефолтное состояние
         *
         * @public
         * @method
         * @name jQuery.fn.controlStatus#base
         * @returns {jQuery}
         */
        base: function () {
            return this.each(function () {
                var $this = $(this),
                    controlStatusData = $this.data('controlStatus'),
                    $formGroup = $this.parent();

                $formGroup.removeClass('has-error');
                $formGroup.removeClass('has-success');
                $this.controlStatus('hideHelper');
                $this.data('controlStatus', _.extend(controlStatusData, {
                    status: null
                }));
            });
        },

        /**
         * Метод удалет все слушатели и чистит все за плагином
         *
         * @public
         * @method
         * @name jQuery.fn.controlStatus#destroy
         * @returns {jQuery}
         */
        destroy: function () {
            return this.each(function () {
                var $this = $(this),
                    $formGroup = $this.parent();

                $this.removeData('controlStatus');
                $formGroup.removeClass('has-feedback');
                $('.form-group-status', $formGroup).remove();
                $('.form-control-feedback', $formGroup).remove();
            });
        }
    };

    $.fn.controlStatus = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }

        if (typeof method === 'object' || !method) {
            return methods.initialize.apply(this, arguments);
        }

        return $.error('Метод с именем ' + method + ' не существует для jQuery.controlStatus');

    };
});