'use strict';

/**
 * Плагин календарей (3 селекта: день, месяк, год)
 */
define([
    'zepto',
    'underscore',
    'utils/helpers'
], function ($, _, Helpers) {
    var defaultOptions = {
            startYear: 1900
        },
        monthsList = Soshace.monthsList,
        methods = {
            /**
             * @constructor
             * @name jQuery.fn.calendar#initialize
             * @param {Object} options
             *                 [options.startYear] - год, с которого начинается календарь
             *                 [options.endYear] - год, на котором заканчивается календарь
             *                 options.selectedDate - выставленная дата в календаре
             *                 options.dateField - имя поля даты
             *                 options.monthField - имя поля месяца
             *                 options.fullYearField - имя поля года
             * @returns {jQuery}
             */
            initialize: function (options) {
                var pluginOptions = _.extend(defaultOptions, options);

                return this.each(_.bind(function () {
                    var $this = $(this);
                    $this.calendar('_setOptions', pluginOptions);
                    $this.calendar('_render');
                    $this.calendar('_addListeners');
                }, this));
            },

            /**
             * Метод добавляет слушатели на элемент календаря
             *
             * @private
             * @method
             * @name jQuery.fn.calendar#addListeners
             * @returns {jQuery}
             */
            _addListeners: function () {
                this.on('change', '.js-calendar-date', _.bind(function (event) {
                    this.calendar('_dateChangeHandler', event);
                }, this));
                this.on('change', '.js-calendar-month', _.bind(function (event) {
                    this.calendar('_monthChangeHandler', event);
                }, this));
                this.on('change', '.js-calendar-year', _.bind(function (event) {
                    this.calendar('_yearChangeHandler', event);
                }, this));

                return this;
            },

            /**
             * Метод слушатель изменения даты
             *
             * @private
             * @method
             * @name jQuery.fn.calendar#dateChangeHandler
             * @param {jQuery.Event} event
             * @returns {jQuery}
             */
            _dateChangeHandler: function (event) {
                var $target = $(event.target),
                    selectedDate = this.calendar('getDate'),
                    selectedDateObj = new Date(selectedDate),
                    value = $target.val();

                selectedDateObj.setDate(value);
                selectedDate = selectedDateObj.getTime();
                this.calendar('setDate', selectedDate);

                return this;
            },

            /**
             * Метод слушатель изменения месяца
             *
             * @private
             * @method
             * @name jQuery.fn.calendar#monthChangeHandler
             * @param {jQuery.Event} event
             * @returns {jQuery}
             */
            _monthChangeHandler: function (event) {
                var $target = $(event.target),
                    selectedDate = this.calendar('getDate'),
                    selectedDateObj = new Date(selectedDate),
                    value = $target.val();

                selectedDateObj.setMonth(value);
                selectedDate = selectedDateObj.getTime();
                this.calendar('setDate', selectedDate);

                return this;
            },

            /**
             * Метод слушатель изменения года
             *
             * @private
             * @method
             * @name jQuery.fn.calendar#yearChangeHandler
             * @param {jQuery.Event} event
             * @returns {jQuery}
             */
            _yearChangeHandler: function (event) {
                var $target = $(event.target),
                    selectedDate = this.calendar('getDate'),
                    selectedDateObj = new Date(selectedDate),
                    value = $target.val();

                selectedDateObj.setFullYear(value);
                selectedDate = selectedDateObj.getTime();
                this.calendar('setDate', selectedDate);

                return this;
            },

            /**
             * Метод рендерит календари на основе параметров
             *
             * @private
             * @method
             * @name jQuery.fn.calendar#render
             * @returns {undefined}
             */
            _render: function () {
                var lists = this.calendar('getLists'),
                    options = this.calendar('getOptions'),
                    template = Soshace.hbs['partials/jquery/calendar/calendar'](
                        _.extend(lists, options));

                this.html(template);
            },

            /**
             * Метод сохраняет настройки в данных элемента
             *
             * @private
             * @method
             * @name jQuery.fn.calendar#setOptions
             * @param {Object} options
             * @returns {undefined}
             */
            _setOptions: function (options) {
                var pluginOptions = this.calendar('getOptions') || {},
                    fullOptions = _.extend(pluginOptions, options),
                    selectedDate = fullOptions.selectedDate,
                    today = new Date();

                fullOptions.selectedDate = selectedDate || today.getTime();
                this.data('calendar', fullOptions);
            },

            /**
             * Метод возвращает параметры контрола
             *
             * @public
             * @method
             * @name jQuery.fn.calendar#getOptions
             * @returns {Object}
             */
            getOptions: function () {
                return this.data('calendar');
            },

            /**
             * Метод возвращает списки дат, месяцев и лет
             *
             * @public
             * @method
             * @name jQuery.fn.calendar#getLists
             * @returns {Object}
             */
            getLists: function () {
                var _this = this;

                return {
                    datesList: _this.calendar('getDatesList'),
                    monthsList: _this.calendar('getMothsList'),
                    fullYearsList: _this.calendar('getYearsList')
                };
            },

            /**
             * Метод возвращает список лет
             *
             * @public
             * @method
             * @name jQuery.fn.calendar#getYearsList
             * @returns {Array}
             */
            getYearsList: function () {
                var currentDate = new Date(),
                    currentYear = currentDate.getFullYear(),
                    options = this.calendar('getOptions'),
                    startYear = options.startYear,
                    endYear = options.endYear,
                    selectedYear = this.calendar('getSelectedYear'),
                    isSelected,
                    year,
                    list = [];

                endYear = endYear || currentYear;

                for (year = startYear; year <= endYear; year++) {
                    isSelected = year === selectedYear;
                    list.push({
                        value: year,
                        title: year,
                        selected: isSelected
                    });
                }
                return list;
            },

            /**
             * Метод возвращает установленный год
             *
             * @public
             * @method
             * @name jQuery.fn.calendar#getSelectedYear
             * @returns {Number}
             */
            getSelectedYear: function () {
                var options = this.calendar('getOptions'),
                    selectedDate = options.selectedDate,
                    selectedDateObj;

                selectedDateObj = new Date(selectedDate);
                return selectedDateObj.getFullYear();
            },

            /**
             * Метод возвращает список месяцев
             *
             * @public
             * @method
             * @name jQuery.fn.calendar#getMothsList
             * @returns {Array}
             */
            getMothsList: function () {
                var selectedMonth = this.calendar('getSelectedMonth'),
                    months = _.clone(monthsList);

                _.each(months, function (month) {
                    var title = month.title,
                        value = month.value;

                    month.title = Helpers.i18n(title);
                    month.selected = value === selectedMonth;
                });

                return months;
            },

            /**
             * Метод возвращает установленный месяц
             *
             * @public
             * @method
             * @name jQuery.fn.calendar#getSelectedMonth
             * @returns {Number}
             */
            getSelectedMonth: function () {
                var options = this.calendar('getOptions'),
                    selectedDate = options.selectedDate,
                    selectedDateObj;

                selectedDateObj = new Date(selectedDate);
                return selectedDateObj.getMonth();
            },

            /**
             * Метод возвращает список дат
             *
             * @public
             * @method
             * @name jQuery.fn.calendar#getDatesList
             * @returns {Array}
             */
            getDatesList: function () {
                var dates = [],
                    date,
                    isSelected,
                    selectedDate = this.calendar('getSelectedDate'),
                    daysInMonth = this.calendar('getDaysInMonth');

                for (date = 1; date <= daysInMonth; date++) {
                    isSelected = date === selectedDate;
                    dates.push({
                        title: date,
                        value: date,
                        selected: isSelected
                    });
                }

                return dates;
            },

            /**
             * Метод возвращает количество дней в текущем месяце
             *
             * @public
             * @method
             * @name jQuery.fn.calendar#getDaysInMonth
             * @returns {number}
             */
            getDaysInMonth: function () {
                var year = this.calendar('getSelectedYear'),
                    month = this.calendar('getSelectedMonth');

                return new Date(year, month + 1, 0).getDate();
            },

            /**
             * Метод возвращает установленный день
             *
             * @public
             * @method
             * @name jQuery.fn.calendar#getSelectedDate
             * @returns {Number}
             */
            getSelectedDate: function () {
                var options = this.calendar('getOptions'),
                    selectedDate = options.selectedDate,
                    selectedDateObj;

                selectedDateObj = new Date(selectedDate);
                return selectedDateObj.getDate();
            },

            /**
             * Метод устанавливает дату календаря
             *
             * @public
             * @method
             * @name jQuery.fn.calendar#setDate
             * @param {String} selectedDate timestamp текущей даты
             * @returns {jQuery}
             */
            setDate: function (selectedDate) {
                return this.each(function () {
                    var $this = $(this);

                    $this.calendar('_setOptions', {selectedDate: selectedDate});
                    $this.calendar('_render');
                    $this.trigger('calendar.updated', selectedDate);
                });
            },

            /**
             * Метод возвращает timestamp выставленной даты
             *
             * @public
             * @method
             * @name jQuery.fn.calendar#getDate
             * @returns {String}
             */
            getDate: function () {
                var options = this.calendar('getOptions');
                return options.selectedDate;
            }
        };

    $.fn.calendar = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }

        if (typeof method === 'object' || !method) {
            return methods.initialize.apply(this, arguments);
        }

        return $.error('Метод с именем ' + method + ' не существует для jQuery.calendar');

    };
});