'use strict';

var Controller = srcRequire('common/controller'),
    _ = require('underscore'),
    PostsModel = srcRequire('models/postsModel'),
    RequestParams = srcRequire('common/requestParams');


/**
 * Контроллер содержащий методы работы с постами
 *
 * @class PostsController
 */
module.exports = Controller.extend({

    /**
     * Метод перенаправляет на тсраницу постов
     *
     * @method
     * @name PostsController#redirectToPosts
     * @returns {undefined}
     */
    redirectToPosts: function () {
        var request = this.request,
            response = this.response,
            locale = request.i18n.getLocale();

        response.redirect('/' + locale);
    },

    /**
     * Получаем пост целиком
     *
     * @method
     * @name PostsController#getPost
     * @return {undefined}
     */
    getPost: function () {
        var request = this.request,
            response = this.response,
            params = request.params,
            postId = params._id;

        PostsModel.getPost(postId, _.bind(function (error, post) {
            if(error){
                this.sendError(error);
                return;
            }

            if (post) {
                return response.send(post);
            }

            return response.send({noPost: true});
        }, this));
    },

    /**
     * Получаем список постов
     *
     * @method
     * @name PostsController#getPosts
     * @return {undefined}
     */
    getPosts: function () {
        var request = this.request,
            response = this.response,
            query = request.query,
            requestParams = new RequestParams(request),
            locale = requestParams.locale,
            ownerId = query.ownerId;

        if (ownerId) {
            this.getUserPosts(ownerId);
            return;
        }

        PostsModel.getPosts(locale, function (error, posts) {
            if (error) {
                this.sendError(error);
                return;
            }

            return response.send(posts);
        });
    },

    /**
     * Получаем список статей пользователя
     *
     * @method
     * @name PostsController#getUserPosts
     * @param {String} userId id пользователя
     * @return {undefined}
     */
    getUserPosts: function (userId) {
        var request = this.request,
            response = this.response,
            requestParams = new RequestParams(request),
            isAuthenticated = requestParams.isAuthenticated,
            profileId;

        if (isAuthenticated) {
            profileId = requestParams.profile._id;
            if (String(userId) === String(profileId)) {
                PostsModel.getProfilePosts(profileId, _.bind(function (error, posts) {
                    if (error) {
                        this.sendError(error);
                        return;
                    }
                    response.send(posts);
                }, this));
                return;
            }
        }

        PostsModel.getUserPosts(userId, _.bind(function (error, posts) {
            if (error) {
                this.sendError(error);
                return;
            }
            response.send(posts);
        }, this));
    },

    /**
     * Метод удаляет статью
     *
     * @method
     * @name PostsController#removePost
     * @returns {undefined}
     */
    removePost: function () {
        var request = this.request,
            response = this.response,
            params = request.params,
            postId = params._id;

        PostsModel.removePost(postId, _.bind(function(error){
            if(error){
                this.sendError(error);
                return;
            }

            response.send('success');
        }, this));
    },

    /**
     * Рендерим страницу поста
     *
     * @method
     * @name PostsController#renderPost
     * @return {undefined}
     */
    renderPost: function () {
        var request = this.request,
            response = this.response,
            requestParams = new RequestParams(request),
            postId = request.params._id;

        PostsModel.getPost(postId, _.bind(function (error, post) {
            if (post) {
                response.render('posts/post', _.extend(requestParams, {
                    post: post,
                    title: post.title
                }));
                return;
            }
            this.renderError('Page not found', 404);
        }, this));
    },

    /**
     * Рендерим список постов
     *
     * @method
     * @name PostsController#renderPosts
     * @return {undefined}
     */
    renderPosts: function () {
        var request = this.request,
            response = this.response,
            requestParams = new RequestParams(request),
            locale = requestParams.locale;

        PostsModel.getPosts(locale, function (error, posts) {
            response.render('posts/posts', _.extend(requestParams, {
                isHomeTab: true,
                title: 'Soshace blog',
                posts: posts
            }));
        });
    }
});