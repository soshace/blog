'use strict';
var Controller = srcRequire('common/controller');

//TODO: отдавать ошибки в json, если запрос в json

/**
 * Контроллер страниц ошибок
 *
 * @class ErrorsController
 */
module.exports = Controller.extend({
    /**
     * Метод рендерит страницу 404
     *
     * @method
     * @name ErrorsController#render404
     * @returns {undefined}
     */
    render404: function () {
        this.renderError('Page not found', 404);
    }
});