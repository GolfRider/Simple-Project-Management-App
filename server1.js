/**
* Dependencies.
*/
var Hapi = require('hapi'),
    config = require('./server/config/settings');

var fs = require('fs');

// Create a server with a host, port, and options
var server = Hapi.createServer('0.0.0.0', config.port, config.hapi.options);

// Export the server to be required elsewhere.
module.exports = server;

// Bootstrap Hapi Server Plugins, passes the server object to the plugins
require('./server/config/plugins')(server);
module.exports = function(server) {
    // Options to pass into the 'Good' plugin
    var goodOptions = {
        subscribers: {
            console: ['ops', 'request', 'log', 'error']
        }
    };
    // The Assets Configuaration Options
    var assetOptions = require('../../assets');

    server.pack.register([
        {
            plugin: require('good'),
            options: goodOptions
        },
        {
            plugin: require('hapi-assets'),
            options: assetOptions
        },
        {
            plugin: require('hapi-named-routes')
        },
        {
            plugin: require('hapi-cache-buster')
        }		
    ], function(err) {
        if (err) throw err;
    });
};

// Require the routes and pass the server object.
var routes = require('./server/config/routes')(server);
// Add the server routes
server.route(routes);
/**
* Dependencies.
*/
var requireDirectory = require('require-directory');


module.exports = function(server) {
    // Bootstrap your controllers so you dont have to load them individually. This loads them all into the controller name space. https://github.com/troygoode/node-require-directory
    var controller = requireDirectory(module, '../controllers');

    // Array of routes for Hapi
    var routeTable = [
	    {
            method: 'GET',
            path: '/signout',
            config: controller.base.signout
        },
		{
            method: 'POST',
            path: '/signin',
            config: controller.base.signin
        },
		{
            method: 'GET',
            path: '/signup',
            config: controller.base.signup
        },
		{
            method: 'GET',
            path: '/signup_success',
            config: controller.base.signupSuccess
        },
		{
            method: 'POST',
            path: '/signup',
            config: controller.base.doSignup
        },
		{
            method: 'GET',
            path: '/project/s/{id}',
            config: controller.base.showTasks
        },
		{
            method: 'GET',
            path: '/task/{id}',
            config: controller.base.taskDetails
        },
		{
            method: 'POST',
            path: '/comment',
            config: controller.base.addComment
        },
		{
            method: 'POST',
            path: '/tasks',
            config: controller.base.addTasks
        },
		{
            method: 'GET',
            path: '/projects',
            config: controller.base.showProjects
        },
		{
            method: 'POST',
            path: '/projects',
            config: controller.base.addProjects
        },
		{
            method: 'GET',
            path: '/files',
            config: controller.base.files
        },
	    {
            method: 'POST',
            path: '/upload',
            config: controller.base.upload
        },
	   {
            method: 'GET',
            path: '/download/{file}',
            config: controller.base.download
        },
		{
            method: 'GET',
            path: '/about',
            config: controller.base.about
        },
        {
            method: 'GET',
            path: '/',
            config: controller.base.index
        },
        {
            method: 'GET',
            path: '/{path*}',
            config: controller.base.missing
        },
        {
            method: 'GET',
            path: '/partials/{path*}',
            config: controller.assets.partials
        },
        {
            method: 'GET',
            path: '/images/{path*}',
            config: controller.assets.images
        },
        {
            method: 'GET',
            path: '/css/{path*}',
            config: controller.assets.css
        },
        {
            method: 'GET',
            path: '/js/{path*}',
            config: controller.assets.js
        },
        {
            method: 'GET',
            path: '/bower_components/{path*}',
            config: controller.assets.bower
        }
    ];
    return routeTable;
}

//Start the server
server.start(function() {
    //Log to the console the host and port info
    console.log('Server started at: ' + server.info.uri);
});
/**
* Dependencies.
*/
var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');

// Defaults that you can access when you require this config.
module.exports = {
    root: rootPath,
    port: parseInt(process.env.PORT, 10) || 3000,
    hapi: {
        options: {
            views: {
                path: './server/views',
                engines: {
                    html: require('swig')
                }
            }
        }
    }
}
// This is the assets controller. Goal is to serve css, js, partials, images, or bower packages.
// This is the assets controller. Goal is to serve css, js, partials, images, or bower packages.
module.exports = {
    partials: {
        handler: {
            directory: { path: './server/views/partials' }
        },
        app: {
            name: 'partials'
        }
    },
    images: {
        handler: {
            directory: { path: './public/images' }
        },
        app: {
            name: 'images'
        }
    },
    css: {
        handler: {
            directory: { path: './public/css' }
        },
        app: {
            name: 'css'
        }
    },
    js: {
        handler: {
            directory: { path: './public/js' }
        },
        app: {
            name: 'js'
        }
    },
    bower: {
        handler: {
            directory: { path: './public/bower_components' }
        },
        app: {
            name: 'bower'
        }
    }
}
module.exports = {
    partials: {
        handler: {
            directory: { path: './server/views/partials' }
        },
        app: {
            name: 'partials'
        }
    },
    images: {
        handler: {
            directory: { path: './public/images' }
        },
        app: {
            name: 'images'
        }
    },
    css: {
        handler: {
            directory: { path: './public/css' }
        },
        app: {
            name: 'css'
        }
    },
    js: {
        handler: {
            directory: { path: './public/js' }
        },
        app: {
            name: 'js'
        }
    },
    bower: {
        handler: {
            directory: { path: './public/bower_components' }
        },
        app: {
            name: 'bower'
        }
    }
}

