//TODO: Убрать баги при редактировании поста
//TODO: добавить подзаголовки
//TODO: почему несколько раз проходит PATCH?
'use strict';

/**
 * Вид страницы редактирования статьи
 *
 * @class PostEditView
 */

define([
    'zepto',
    'underscore',
    'backbone',
    'handlebars',
    'utils/helpers',
    'backbone.layoutmanager',
    'templates'
], function ($, _, Backbone, Handlebars, Helpers) {
    return Backbone.Layout.extend({

        /**
         * Позиция панели редактирования при рендере
         *
         * @field
         * @name PostEditView#toolbarInitOffeset
         * @type {Object}
         */
        toolbarInitOffset: null,

        /**
         * @field
         * @name PostEditController#model
         * @type {Backbone.Model}
         */
        model: null,

        /**
         * @field
         * @name PostEditController#hotKeys
         * @type {Object}
         */
        hotKeys: {
            'ctrl+b meta+b': 'bold',
            'ctrl+i meta+i': 'italic',
            'ctrl+u meta+u': 'underline',
            'ctrl+z meta+z': 'undo',
            'ctrl+y meta+y meta+shift+z': 'redo',
            'ctrl+l meta+l': 'justifyleft',
            'ctrl+r meta+r': 'justifyright',
            'ctrl+e meta+e': 'justifycenter',
            'ctrl+j meta+j': 'justifyfull',
            'shift+tab': 'outdent',
            'tab': 'indent'
        },

        /**
         * Список обработчиков ошибок
         *
         * @field
         * @name PostEditView#events
         * @type {Object}
         */
        events: {
            'click .js-post-publish': 'postPublish',
            'keyup .js-post-title': 'saveTileToModel',
            'keyup .js-post-body': 'saveBodyToModel',
            'click .js-simple-command': 'applyCommand',
            'mouseup .js-post-body': 'saveSelection',
            'click .js-add-link': 'showAddLinkModal',
            'click .js-post-delete': 'deletePost'

        },

        /**
         * Объект, содержащий элементы редактора для
         * повторного обращения к ним
         *
         * @field
         * @name PostEditView#elements
         * @type {Object}
         */
        elements: {
            postBody: null,
            postTitle: null,
            toolbar: null,
            addLinkModal: null,
            linkNameInput: null,
            window: null,
            commandBtn: null,
            imageUpload: null,
            deleteButton: null,
            deletePostModal: null,
            status: null,
            statusMessages: null,
            postEdit: null,
            readOnlyReason: null
        },

        /**
         * Интервал,
         * с которым производится запись в модель
         *
         * @field
         * @name PostEditView#setToModelTimeOut
         * @type {Number}
         */
        setToModelTimeOut: 1500,

        /**
         *
         * @field
         * @name PostEditView#selectedRange
         * @type {Object | null}
         */
        selectedRange: null,

        /**
         * Путь до шаблона
         *
         * @field
         * @name PostEditView#elements
         * @type {string}
         */
        template: Soshace.hbs['posts/edit/postEdit'],

        /**
         * @constructor
         * @name PostEditView#initialize
         * @returns {undefined}
         */
        initialize: function () {
            Handlebars.registerPartial(
                'messages/enableEditor',
                Soshace.hbs['partials/messages/enableEditor']
            );
            this.addModelListeners();
        },

        /**
         * TODO: добавить валидацию
         *
         * Метод обработчик клика по кнопке опубликовать
         *
         * @method
         * @name PostEditView#postPublish
         * @returns {undefined}
         */
        postPublish: function () {
            this.model.set('status', 'sent');
            this.blockToolbar();
            this.showPublishButtonLoader();
        },

        /**
         * Метод показывает лоадер на кнопке 'Опубликовать' и блокирует интерфейс
         *
         * @method
         * @name PostEditView#showPublishButtonLoader
         * @returns {undefined}
         */
        showPublishButtonLoader: function () {

        },

        /**
         * Метод блокирует панель инструментов
         *
         * @method
         * @name PostEditView#blockToolbar
         * @returns {undefined}
         */
        blockToolbar: function () {

        },

        /**
         * Метод разблокирует панель инструментов
         *
         * @method
         * @name PostEditView#unBlockToolbar
         * @returns {undefined}
         */
        unBlockToolbar: function () {

        },

        /**
         * Метод добавляет слушатели на модель
         *
         * @method
         * @name PostEditView#addModelListeners
         * @returns {undefined}
         */
        addModelListeners: function () {
            var patchModelDebounce,
                model = this.model;

            patchModelDebounce = _.debounce(model.patchModel, this.setToModelTimeOut);
            model.on('change', _.bind(patchModelDebounce, model));
            model.on('postCreated', _.bind(this.postCreatedHandler, this));
            model.on('postPatched', _.bind(this.postPatchHandler, this));
        },

        /**
         * Метод обработчик патча модели на сервере
         *
         * @method
         * @name PostEditView#postPatchHandler
         * @returns {undefined}
         */
        postPatchHandler: function () {
            var status = this.model.get('status');

            if (status === 'sent') {
                this.render();
                window.scrollTo(0, 0);
                return;
            }

            this.showPostStatus();
        },

        /**
         * Метод отображает статус у статьи
         *
         * @method
         * @name PostEditView#showPostStatus
         *  @param {String} [status] название статуса (редактируется, сохранена, создана)
         * @returns {undefined}
         */
        showPostStatus: function (status) {
            var postStatus,
                statuses,
                $status,
                statusSettings,
                statusTitle;

            postStatus = status || this.model.get('status');

            if (typeof postStatus !== 'string') {
                return;
            }

            statuses = this.model.statuses;
            $status = this.elements.status;
            statusSettings = statuses[postStatus];
            statusTitle = Helpers.i18n(statusSettings.title);
            $status.html(statusTitle);
        },

        /**
         * Метод обработчик создания статьи
         *
         * @method
         * @name PostEditView#postCreatedHandler
         * @returns {undefined}
         */
        postCreatedHandler: function () {
            this.elements.deleteButton.removeClass('hide');
            this.showPostStatus();
        },

        /**
         * Метод обработчик
         *
         * @method
         * @name PostEditView#deletePost
         * @returns {undefined}
         */
        deletePost: function () {
            this.elements.deletePostModal.modal({show: true});
        },

        /**
         * Метод обработчик подтверждения удаления статьи в модальном окне
         *
         * @method
         * @name PostEditView#reallyDeletePost
         * @returns {undefined}
         */
        reallyDeletePost: function () {
            var _this = this;
            this.model.destroy({
                contentType: 'application/json',
                dataType: 'text',
                success: _.bind(_this.destroySuccess, _this),
                error: _.bind(_this.destroyFail, _this)
            });
            this.elements.deletePostModal.modal('hide');
        },

        /**
         * Метод обработчик удачного удаления статьи
         *
         * @method
         * @name PostEditView#destroySuccess
         * @returns {undefined}
         */
        destroySuccess: function () {
            var model = this.model,
                locale = Helpers.getLocale(),
                postUrl = '/' + locale + '/posts/' + 'new';

            model.set(model.default, {silent: true});
            Backbone.history.navigate(postUrl, {trigger: true});
        },

        /**
         * TODO: доделать
         * Метод обработчик неудачного удаления статьи
         *
         * @method
         * @name PostEditView#destroyFail
         * @returns {undefined}
         */
        destroyFail: function () {

        },

        /**
         * Метод сохраняет значение поля 'Загловок'  в модели
         *
         * @method
         * @name PostEditView#saveTileToModel
         * @returns {undefined}
         */
        saveTileToModel: function () {
            var $title = this.elements.postTitle,
                currentValue = this.model.get('title'),
                value = $title.val();

            if (currentValue === value) {
                return;
            }

            this.showPostStatus('editing');
            this.model.set('title', value);
        },

        /**
         * Метод сохраняет тело статьи  в модели
         *
         * @method
         * @name PostEditView#saveBodyToModel
         * @returns {undefined}
         */
        saveBodyToModel: function () {
            var $postBody = this.elements.postBody,
                currentValue = this.model.get('body'),
                value = $postBody.html();

            if (currentValue === value) {
                return;
            }

            this.model.set('body', value);
            this.showPostStatus('editing');
            this.saveSelection();
        },

        /**
         * Метод обработчик клика по кнопке редактирования на тулбаре
         *
         *
         * @method
         * @name PostEditView#applyCommand
         * @param {jQuery.Event} event
         * @returns {undefined}
         */
        applyCommand: function (event) {
            var $target = $(event.target),
                $button = $target.closest('.js-command'),
                command = $button.data('edit');

            this.elements.postBody.focus();
            this.restoreSelection();
            this.execCommand(command, null);
            $button.toggleClass('active');
        },

        /**
         * Метод делает активной кнопку, если к выделенному
         * тексту применена команада
         *
         * @method
         * @name PostEditView#updateToolbar
         * @returns {undefined}
         */
        updateToolbar: function () {
            this.elements.commandBtn.each(function () {
                var $button = $(this),
                    command = $button.data('edit');

                if (document.queryCommandState(command)) {
                    $button.addClass('active');
                } else {
                    $button.removeClass('active');
                }
            });
        },

        /**
         * Метод обработчик скрола окна
         *
         * @method
         * @name PostEditView#windowScrollHandler
         * @returns {undefined}
         */
        windowScrollHandler: function () {
            var toolbar = this.elements.toolbar,
                toolbarPosition = this.toolbarInitOffset,
                toolbarPositionTop = toolbarPosition.top,
                $window = this.elements.window,
                scrollTop = $window.scrollTop(),
                toolbarIsOut = scrollTop >= toolbarPositionTop;

            toolbar.toggleClass('post-edit__toolbar-fixed', toolbarIsOut);
        },

        /**
         * TODO: доработать описание параметров
         *
         * Метод для работы с выделенным текстом
         *
         * @method
         * @name PostEditView#execCommand
         * @param {string} commandWithArgs
         * @param {string} valueArg
         * @returns {undefined}
         */
        execCommand: function (commandWithArgs, valueArg) {
            var commandArr = commandWithArgs.split(' '),
                command = commandArr.shift(),
                args = commandArr.join(' ') + (valueArg || '');

            document.execCommand(command, null, args);
        },

        /**
         * TODO: доработать описание
         *
         * Метод навешивает слушатель на тело редактора
         * Слушает нажатие горячих клавиш
         *
         * @method
         * @name PostEditView#execCommand
         * @param {Object} hotKeys список горячих клавиш
         * @returns {undefined}
         */
        bindHotKeys: function (hotKeys) {
            $.each(hotKeys, _.bind(function (hotKey, command) {
                this.elements.postBody.keydown(hotKey, _.bind(function () {
                        this.execCommand(command, null);
                        return false;
                    }, this)).keyup(hotKey, _.bind(function (event) {
                        if (this.elements.postBody.attr('contenteditable') &&
                            this.elements.postBody.is(':visible')) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }, this));
            }, this));
        },


        /**
         * Возвращает объект с информацией о выделенном участке
         * текста
         *
         * @method
         * @name PostEditView#execCommand
         * @returns {Range|null}
         */
        getCurrentRange: function () {
            var sel = window.getSelection();

            if (sel.getRangeAt && sel.rangeCount) {
                return sel.getRangeAt(0);
            }

            return null;
        },

        /**
         * Сохраняет информацию о выделленой области
         * в приватной переменной selectedRange
         *
         * @method
         * @name PostEditView#saveSelection
         * @returns {undefined}
         */
        saveSelection: function () {
            this.selectedRange = this.getCurrentRange();
            this.updateToolbar();
        },

        /**
         * Метод восстанавливает выделение в редакторе
         *
         * @method
         * @name PostEditView#restoreSelection
         * @returns {undefined}
         */
        restoreSelection: function () {
            var selection = window.getSelection();

            if (this.selectedRange) {
                try {
                    selection.removeAllRanges();
                } catch (exception) {
                    document.body.createTextRange().select();
                    document.selection.empty();
                }

                selection.addRange(this.selectedRange);
            }

            this.updateToolbar();
        },

        /**
         * Метод показывает модальное окно
         *
         * @method
         * @name PostEditView#showAddLinkModal
         * @returns {undefined}
         */
        showAddLinkModal: function () {
            this.elements.addLinkModal.modal({show: true});
        },

        /**
         * Метод обработчик клика по кнопке
         * 'Сохранить' в модальном окне добавления ссылки
         *
         * @method
         * @name PostEditView#saveLinkHandler
         * @returns {undefined}
         */
        saveLinkHandler: function () {
            var url = this.elements.linkUrlInput.val();
            this.restoreSelection();
            this.execCommand('CreateLink', url);
            this.elements.addLinkModal.modal('hide');
        },

        /**
         * Метод навешивает слушатель на кнопку загрузки
         * изображения
         *
         * @method
         * @name PostEditView#addImageButtonListener
         * @returns {undefined}
         */
        addImageButtonListener: function () {
            var _this = this,
                preLoader = $('<img>', {
                    src: Soshace.urls.images + 'preloader.gif',
                    class: 'img-responsive center'
                });

            //TODO: блокировать панель до загрузки первого изображения
            //TODO: добавить обработку ошибок
            this.elements.imageUpload.fileupload({
                url: Soshace.urls.api.images,
                dataType: 'json',
                done: function (event, data) {
                    var result = data.result;

                    preLoader.remove();

                    if (result.error) {
                        //TODO: добавить отображение ошибки
                        return;
                    }

                    _this.elements.postBody.append($('<img>', {
                        src: result.path,
                        class: 'img-responsive'
                    }));
                }
            }).on('change', function () {
                    _this.elements.postBody.append(preLoader);
                });
        },

        /**
         * Метод сохраняет ссылки на элементы DOM
         *
         * @method
         * @name PostEditView#setElements
         * @returns {undefined}
         */
        setElements: function () {
            this.elements.window = $(window);
            this.elements.toolbar = this.$('.js-editor-toolbar');
            this.elements.statusMessages = this.$('.js-status-messages');
            this.elements.commandBtn = this.$('.js-command');
            this.elements.postBody = this.$('.js-post-body');
            this.elements.postTitle = this.$('.js-post-title');
            this.elements.addLinkModal = $(Soshace.hbs['posts/edit/addLinkModal']());
            this.elements.deletePostModal = $(Soshace.hbs['posts/edit/deletePostModal']());
            this.elements.linkUrlInput = $('.js-add-link-modal-link-url', this.elements.addLinkModal);
            this.elements.imageUpload = this.$('.js-upload-image input');
            this.elements.deleteButton = this.$('.js-post-delete');
            this.elements.status = this.$('.js-post-status');
            this.elements.postEdit = this.$('.js-post-edit');
            this.elements.readOnlyReason = this.$('.js-read-only-reason');
        },

        /**
         * Метод возвращает True, если редактор должен быть заблокирован
         * Если пользователь не авторизован или у пользователя не подтвержден email
         * см. Wiki
         *
         * @method
         * @name PostEditView#isEditorDisabled
         * @returns {Boolean}
         */
        isEditorDisabled: function () {
            var app = Soshace.app,
                isAuthenticated = app.isAuthenticated(),
                profile;

            if (!isAuthenticated) {
                return true;
            }

            profile = Soshace.profile;
            return !profile.emailConfirmed;
        },

        /**
         * Метод возвращает true для владельцев статьи,
         * если статья имеет статус 'Опубликована' или 'Отправлена'
         * см. Wiki
         *
         * @method
         * @name PostEditView#readOnly
         * @returns {Boolean}
         */
        readOnly: function () {
            var app = Soshace.app,
                isAuthenticated = app.isAuthenticated(),
                ownerId,
                isOwner,
                status,
                profile,
                profileId;

            if (!isAuthenticated) {
                return false;
            }
            profile = Soshace.profile;
            profileId = profile._id;
            ownerId = this.model.get('ownerId');
            isOwner = ownerId === profileId;

            if (!isOwner) {
                return false;
            }

            status = this.model.get('status');

            //Если в статусе 'отправлена'
            if (status === 'sent') {
                return true;
            }

            //Если статья в статусе 'Опубликовано'
            return status === 'published';
        },

        /**
         * @method
         * @name PostEditView#serialize
         * @returns {Object}
         */
        serialize: function () {
            var app = Soshace.app,
                data = this.model.toJSON();

            data.title = Helpers.i18n('Edit Post');
            data.editorDisabled = this.isEditorDisabled();
            data.paths = Soshace.urls;
            data.post = this.model.toJSON();
            data.isNew = this.model.isNew();
            data.readOnly = this.readOnly();
            data.isAuthenticated = app.isAuthenticated();

            return data;
        },

        /**
         * TODO: сейчас не вызывается!
         *
         * Метод вызывается роутером перед выходом из вида
         *
         * @method
         * @name PostEditView#viewExitHandler
         * @returns {undefined}
         */
        viewExitHandler: function () {
            this.elements.window.off('scroll', this.windowScrollHandler);
        },

        /**
         * Метод добавляет слушатели на модальное окно добавлтения ссылки
         *
         * @method
         * @name PostEditView#addListenersToLinkModal
         * @returns {undefined}
         */
        addListenersToLinkModal: function () {
            this.elements.addLinkModal.on('click', '.js-add-link-save',
                _.bind(this.saveLinkHandler, this));
        },

        /**
         * Метод навешивает слушатели на модальное окно подтверждения удаления статьи
         *
         * @method
         * @name PostEditView#addListenersToRemovePostModal
         * @returns {undefined}
         */
        addListenersToRemovePostModal: function () {
            this.elements.deletePostModal.on('click',
                '.js-modal-post-delete', _.bind(this.reallyDeletePost, this));
        },

        /**
         * @method
         * @name PostEditView#afterRender
         * @returns {undefined}
         */
        afterRender: function () {
            this.setElements();
            this.showStatusMessages();
            this.toolbarInitOffset = this.elements.toolbar.offset();
        },

        /**
         * Метод показывает сообщения в зависимости от статуса статьи
         *
         * @method
         * @name PostEditView#showStatusMessages
         * @returns {undefined}
         */
        showStatusMessages: function () {
            var statusMessages = this.elements.statusMessages,
                status = this.model.get('status'),
                statusSettings = this.model.statuses[status],
                messagePath = statusSettings && statusSettings.statusMessage,
                editorMessage = statusSettings && statusSettings.editorMessage;

            if (typeof messagePath !== 'undefined') {
                statusMessages.html(Soshace.hbs[messagePath]());
            }

            if (typeof editorMessage !== 'undefined') {
                this.showEditorReadOnlyReason(editorMessage);
            }
        },

        /**
         * Метод отображает причину статуса 'Только для чтения'
         *
         * @method
         * @name PostEditView#showEditorReadOnlyReason
         * @param {String} editorMessage
         * @returns {undefined}
         */
        showEditorReadOnlyReason: function (editorMessage) {
            var $readOnlyReason = this.elements.readOnlyReason;

            editorMessage = Helpers.i18n(editorMessage);
            $readOnlyReason.html(editorMessage);
            $readOnlyReason.removeClass('hide');
        },

        /**
         * Метод добавляет слушатели на вид
         *
         * @method
         * @name PostEditController#addListeners
         * @returns {undefined}
         */
        addListeners: function () {
            if (!this.isEditorDisabled()) {
//                this.addImageButtonListener();
                this.addListenersToLinkModal();
                this.addListenersToRemovePostModal();
                this.elements.window.on('scroll', _.bind(this.windowScrollHandler, this));
            }
        },

        /**
         * Метод вызывается, когда рендер шаблона осуществляется на сервере
         *
         * @method
         * @name PostEditView#withoutRender
         * @param {jQuery} $el
         * @returns {undefined}
         */
        withoutRender: function ($el) {
            this.$el = $el;
            this.delegateEvents();
            this.setElements();
            this.toolbarInitOffset = this.elements.toolbar.offset();
            this.setDataToModelFromView();
            this.addListeners();
            this.showStatusMessages();
        },

        /**
         * Метод записывает в модель данные, пришедшие в
         * шаблоне.
         *
         * Используется при первом рендере
         *
         * @method
         * @name PostEditView#setDataToModelFromView
         * @returns {undefined}
         */
        setDataToModelFromView: function () {
            var postEdit = this.elements.postEdit,
                data = postEdit.data(),
                $title = this.elements.postTitle,
                $body = this.elements.postBody,
                title = $title.val(),
                body = $body.html();

            if (title) {
                data.title = title;
            }

            if (body) {
                data.body = body;
            }

            this.model.set(data, {silent: true});
        }
    });
});