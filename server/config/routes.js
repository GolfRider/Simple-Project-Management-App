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
