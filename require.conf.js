require.config(
    {
        baseUrl: '/static/scripts/',
        paths: {
            'zepto': 'vendors/zepto',
            'deferred': 'vendors/zepto/deferred',
            'callbacks': 'vendors/zepto/callbacks',
            'data': 'vendors/zepto/data',
            'underscore': 'vendors/underscore',
            'handlebars': 'vendors/handlebars',
            'class': 'vendors/class',
            'google-analytics': 'vendors/google-analytics',
            'yandex-metrika': 'vendors/yandex-metrika',
            'jquery.cookie': 'vendors/jquery/jquery.cookie',
            'backbone': 'vendors/backbone',
            'backbone.layoutmanager': 'vendors/backbone/backbone.layoutmanager',
            'backbone.validation': 'vendors/backbone/backbone.validation'

        },
        shim: {
            underscore: {
                exports: '_'
            },
            zepto: {
                exports: '$'
            },
            'jquery.cookie': {
                deps: [
                    'zepto'
                ]
            },
            'backbone': {
                deps: [
                    'zepto',
                    'underscore'
                ],
                exports: 'Backbone'
            },
            'backbone.layoutmanager': {
                deps: [
                    'backbone'
                ]
            },
            'handlebars': {
                exports: 'Handlebars'
            },
            'class': {
                exports: 'Class'
            }
        },
        deps: [
            'app'
        ]
    }
);