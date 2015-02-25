require.config(
    {
        baseUrl: '/static/scripts/',
        paths: {
            'jquery': 'vendors/jquery',
            'underscore': 'vendors/underscore',
            'underscore.string': 'vendors/underscore/underscore.string',
            'bootstrap': 'vendors/bootstrap',
            'prettify': 'vendors/prettify',
            'handlebars': 'vendors/handlebars',
            'backbone': 'vendors/backbone',
            'jquery.cookie': 'vendors/jquery/jquery.cookie'
        },
        shim: {
            underscore: {
                exports: '_'
            },
            jquery: {
                exports: '$'
            },
            'bootstrap': {
                deps: [
                    'jquery'
                ]
            },
            'jquery.cookie': {
                deps: [
                    'jquery'
                ]
            },
            'backbone': {
                deps: [
                    'jquery',
                    'underscore'
                ],
                exports: 'Backbone'
            }
        },
        deps: [
            'admin'
        ]
    }
);