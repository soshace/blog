'use strict';

define([
    'zepto',
    'underscore',
    'views/admin/postReView',
    'config'
], function (
    $,
    _,
    PostReview) {

    if($('.js-post-review').length){
        new PostReview();
    }
});



