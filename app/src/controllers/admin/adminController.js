'use strict';
var _ = require('underscore'),
    Controller = srcRequire('common/controller'),
    PostsModel = srcRequire('models/postsModel'),
    RequestParams = srcRequire('common/requestParams');

/**
 * Контроллер страницы адмистрирования
 *
 * @class AdminController
 */
module.exports = Controller.extend({
    /**
     * Рендерим страницу регистрации
     *
     * @method
     * @name AdminController#renderLogin
     * @return {undefined}
     */
    renderAdmin: function () {
        var request = this.request,
            requestParams = new RequestParams(request),
            locale = requestParams.locale;

        if (!requestParams.isAuthenticated) {
            this.renderError('Page not found', 404);
            return;
        }

        if (!requestParams.profile.admin) {
            this.renderError('Page not found', 404);
            return;
        }

        PostsModel.getStatusSentPosts(locale, _.bind(this.renderAdminHandler, this));
    },

    /**
     * Метод рендерит страницу для адмистрирования после
     * получения статей для адмистирования
     *
     * @method
     * @name AdminController#renderAdminHandler
     * @param {Object} error
     * @param {Array} posts список стай для администрирования
     * @returns {undefined}
     */
    renderAdminHandler: function (error, posts) {
        var request = this.request,
            response = this.response,
            requestParams = new RequestParams(request);

        if (error) {
            //TODO: сделать рендер страниц ошибок
            this.render('');
            return;
        }

        response.render('admin/admin', _.extend(requestParams, {
            layout: 'admin',
            posts: posts,
            title: 'Admin page'
        }));
    },

    /**
     * Метод рендерит страницу ревью статьи в вдминке
     *
     * @method
     * @name AdminController#renderPostReview
     * @returns {undefined}
     */
    renderPostReview: function () {
        var request = this.request,
            requestParams = new RequestParams(request),
            params = request.params,
            postId = params._id;

        if (!requestParams.isAuthenticated) {
            this.renderError('Page not found', 404);
            return;
        }

        if (!requestParams.profile.admin) {
            this.renderError('Page not found', 404);
            return;
        }

        PostsModel.getPost(postId, _.bind(this.renderPostReviewHandler, this));
    },

    /**
     * Метод рендерит страницу ревью статьи после
     * получения контента стать из базы
     *
     * @method
     * @name AdminController#renderPostReviewHandler
     * @param {Object} error
     * @param {Object} post статья
     * @returns {undefined}
     */
    renderPostReviewHandler: function (error, post) {
        var request = this.request,
            response = this.response,
            requestParams = new RequestParams(request);

        if (error) {
            //TODO: сделать рендер страниц ошибок
            this.render('');
            return;
        }

        response.render('admin/postReview', _.extend(requestParams, {
            layout: 'admin',
            post: post,
            title: post.title
        }));
    }
});