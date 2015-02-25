'use strict';

module.exports = function (grunt) {

    // Загружает grunt tasks автоматически
    require('load-grunt-tasks')(grunt);

    //Модуль показывает время выполнения всех задач в консоли
    require('time-grunt')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // Настройки проекта
        blog: {
            // Путь до проекта
            app: 'app',
            //Папка, в котрую grunt будет сливать получившуюся после
            //после сбоки и минификации статику
            dist: 'dist'
        },

        //следит за изменениями
        watch: {
            scripts: {
                files: '<%= blog.app %>/static/scripts/**/*.js',
                tasks: [
                    'copy:scripts'
                ]
            },
            css: {
                files: '<%= blog.app %>/static/styles/**/*.less',
                tasks: [
                    'less:dev'
                ]
            },
            images: {
                files: '<%= blog.app %>/static/images/{,*/}*.{png,jpg,jpeg,gif,svg}',
                tasks: [
                    'copy:images'
                ]
            },
            icons: {
                files: '<%= blog.app %>/static/*.ico',
                tasks: [
                    'copy:images'
                ]
            },
            requireConfig: {
                files: [
                    'require.conf.js',
                    'require.admin.conf.js'
                ],
                tasks: [
                    'copy:requireConfig'
                ]
            },
            fonts: {
                files: '<%= blog.app %>/static/fonts/*',
                tasks: [
                    'copy:fonts'
                ]
            },
            locales: {
                files: '<%= blog.app %>/locales/*.json',
                tasks: [
                    'copy:locales'
                ]
            },
            views: {
                files: '<%= blog.app %>/views/**/*.hbs',
                tasks: [
                    'handlebars'
                ]
            }
        },

        // Очищаем папку статики
        clean: ['<%= blog.dist %>'],

        // Копируем файлы из папки статики
        copy: {
            requireConfig: {
                files: [
                    {
                        dest: '<%= blog.dist %>/require.conf.js',
                        src: 'require.conf.js'
                    },
                    {
                        dest: '<%= blog.dist %>/require.admin.conf.js',
                        src: 'require.admin.conf.js'
                    }
                ]
            },
            scripts: {
                expand: true,
                cwd: '<%= blog.app %>/static/',
                dest: '<%= blog.dist %>',
                src: 'scripts/**/*.js'
            },
            images: {
                expand: true,
                cwd: '<%= blog.app %>/static/',
                dest: '<%= blog.dist %>',
                src: [
                    '*.{ico,png,txt}',
                    'images/{,*/}*.{png,jpg,jpeg,gif,svg}'
                ]
            },
            fonts: {
                expand: true,
                cwd: '<%= blog.app %>/static',
                dest: '<%= blog.dist %>',
                src: 'fonts/*'
            },
            locales: {
                expand: true,
                cwd: '<%= blog.app %>',
                src: 'locales/**/*.json',
                dest: '<%= blog.dist %>'
            },
            prod: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= blog.app %>/static',
                        dest: '<%= blog.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            'scripts/**/*.js',
                            'images/{,*/}*.{png,jpg,jpeg,gif,svg}',
                            'fonts/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '<%= blog.app %>',
                        src: 'locales/**/*.json',
                        dest: '<%= blog.dist %>'
                    }
                ]
            }
        },

        // Проверяем код на наличие синтаксических ошибок
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= blog.app %>/static/{,*/}*.js',
                '<%= blog.app %>/src/{,*/}*.js',
                '!<%= blog.app %>/static/scripts/vendors/{,*/}*.js',
                '!<%= blog.app %>/src/vendors/{,*/}*.js'
            ]
        },

        //Конфигурируем стили
        less: {
            dev: {
                files: {
                    '<%= blog.dist %>/styles/styles.css': '<%= blog.app %>/static/styles/styles.less',
                    '<%= blog.dist %>/styles/admin.css': '<%= blog.app %>/static/styles/admin.less'
                }
            },
            prod: {
                options: {
                    compress: true
                },
                files: {
                    '<%= blog.dist %>/styles/styles.css': '<%= blog.app %>/static/styles/styles.less',
                    '<%= blog.dist %>/styles/admin.css': '<%= blog.app %>/static/styles/admin.less'
                }
            }
        },

        //Собираем скрипты
        requirejs: {
            compile: {
                options: {
                    baseUrl: '<%= blog.dist %>/scripts/',
                    mainConfigFile: 'require.conf.js',
                    out: '<%= blog.dist %>/scripts/scripts.min.js',
                    include: ['vendors/require', 'google-analytics', 'yandex-metrika']
                }
            }
        },

        //Шаблоны
        handlebars: {
            compile: {
                options: {
                    amd: ['handlebars', 'utils/handlebarsHelpers', 'config'],
                    namespace: 'Soshace.hbs',
                    processName: function(filePath) {
                        return filePath.replace(/app\/views\/|\.hbs/g, '');
                    }
                },
                files: {
                    '<%= blog.dist %>/scripts/templates.js': [
                        '<%= blog.app %>/views/auth/**/*.hbs',
                        '<%= blog.app %>/views/messages/**/*.hbs',
                        '<%= blog.app %>/views/plugins/**/*.hbs',
                        '<%= blog.app %>/views/partials/**/*.hbs',
                        '<%= blog.app %>/views/posts/**/*.hbs',
                        '<%= blog.app %>/views/users/**/*.hbs',
                        '<%= blog.app %>/views/404.hbs'
                    ]
                }
            }
        }
    });

    //Девелоперская версия
    grunt.registerTask('copyDev', [
        'copy:requireConfig',
        'copy:scripts',
        'copy:locales',
        'copy:images',
        'copy:fonts'
    ]);

    //Девелоперская версия
    grunt.registerTask('dev', [
        'newer:jshint:all',
        'clean',
        'copyDev',
        'less:dev',
        'handlebars',
        'watch'
    ]);

    //Верия для продакшена
    grunt.registerTask('prod', [
//        'newer:jshint:all',
        'clean',
        'copy:prod',
        'handlebars',
        'requirejs',
        'less:prod'
    ]);

    grunt.registerTask('default', [
        'copyDev',
        'less:dev',
        'handlebars',
        'watch'
    ]);
};