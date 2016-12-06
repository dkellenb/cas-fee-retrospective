"use strict";
require('reflect-metadata');
var nconf = require('nconf');
var SocketIO = require('socket.io');
var express = require('express');
var bodyParser = require('body-parser');
var inversify_express_utils_1 = require('inversify-express-utils');
var inversify_1 = require('inversify');
var types_1 = require('./constant/types');
var tags_1 = require('./constant/tags');
var RetrospectiveController_1 = require('./controller/RetrospectiveController');
var RetrospectiveService_1 = require('./service/RetrospectiveService');
var UserController_1 = require('./controller/UserController');
var _1 = require('./service/');
var UserRepository_1 = require('./repository/UserRepository');
var UserJwtKeyProvider_1 = require('./service/UserJwtKeyProvider');
var dataaccess_1 = require('./repository/dataaccess');
var RetrospectiveRepository_1 = require('./repository/RetrospectiveRepository');
var WebSocketService_1 = require('./service/WebSocketService');
var RetroServer = (function () {
    function RetroServer() {
        // Load configuration
        this.loadConfig();
        // Setup DI kernel
        this.initKernel();
        // Setup inversify inversifyExpressServer
        this.setupInversifyExpressServer();
        // Setup http server instance
        this.initHttpServer();
        // Setup WebSockets
        this.initWebSocket();
        // Setup Database connection
        this.initDb();
    }
    // Start the application
    RetroServer.bootstrap = function () {
        return new RetroServer();
    };
    RetroServer.prototype.loadConfig = function () {
        console.log('Load configuration');
        this.config = nconf.argv()
            .env()
            .file({ file: 'server-config.json' });
    };
    RetroServer.prototype.initKernel = function () {
        console.log('Setup Kernel');
        var kernel = new inversify_1.Kernel();
        kernel.bind(inversify_express_utils_1.TYPE.Controller).to(RetrospectiveController_1.RetrospectiveController).whenTargetNamed(tags_1.default.RetrospectiveController);
        kernel.bind(inversify_express_utils_1.TYPE.Controller).to(UserController_1.UserController).whenTargetNamed(tags_1.default.UserController);
        kernel.bind(types_1.default.RetrospectiveService).to(RetrospectiveService_1.RetrospectiveService).inSingletonScope();
        kernel.bind(types_1.default.RetrospectiveRepository).to(RetrospectiveRepository_1.RetrospectiveRepository).inSingletonScope();
        kernel.bind(types_1.default.UserRepository).to(UserRepository_1.UserRepository).inSingletonScope();
        kernel.bind(types_1.default.UserService).to(_1.UserService).inSingletonScope();
        kernel.bind(types_1.default.UserJwtService).to(_1.UserJwtService).inSingletonScope();
        kernel.bind(types_1.default.UserJwtKeyProvider).to(UserJwtKeyProvider_1.UserStaticJwtKeyProvider).inSingletonScope();
        kernel.bind(types_1.default.WebSocketService).to(WebSocketService_1.WebSocketService).inSingletonScope();
        this.kernel = kernel;
    };
    RetroServer.prototype.setupInversifyExpressServer = function () {
        console.log('Setup InversifyExpressServer');
        var server = new inversify_express_utils_1.InversifyExpressServer(this.kernel);
        server.setConfig(function (app) {
            // Add headers
            app.use(function (req, res, next) {
                // Website you wish to allow to connect
                res.setHeader('Access-Control-Allow-Origin', 'http://' + nconf.get('hostname') + ':' + nconf.get('ui-port'));
                // Request methods you wish to allow
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                // Request headers you wish to allow
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
                // Location must be set as Expose-Header so Angular HTTP will pick it up and make it accessible.
                res.setHeader('Access-Control-Expose-Headers', 'Location');
                // Set to true if you need the website to include cookies in the requests sent
                // to the API (e.g. in case you use sessions)
                res.setHeader('Access-Control-Allow-Credentials', 'true');
                // Pass to next layer of middleware
                next();
            });
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(bodyParser.json());
            app.use(express.static('../client/dist'));
        });
        this.inversifyExpressServer = server;
        this.app = server.build();
    };
    RetroServer.prototype.initHttpServer = function () {
        console.log('Init HTTP Server');
        var hostname = nconf.get('hostname');
        var port = process.env.PORT || parseInt(nconf.get('port'), 10);
        this.serverInstance = this.app.listen(port, hostname, function () {
            console.log('Server started on port ' + port);
            console.log('');
            console.log('REST Services available on:');
            console.log(hostname + ':' + port + '/rest/users');
            console.log(hostname + ':' + port + '/rest/retrospectives');
            console.log('Full REST Documentation is availble on ../documentation/RestAPI.md');
            console.log('');
        });
    };
    RetroServer.prototype.initWebSocket = function () {
        console.log('Init WebSockets');
        var socketIO = SocketIO().listen(this.serverInstance, {
            'path': '/socket/'
        });
        var webSocketService = this.kernel.get(types_1.default.WebSocketService);
        webSocketService.registerSocketIO(socketIO);
        this.socketIO = socketIO;
    };
    RetroServer.prototype.initDb = function () {
        console.log('Init DB');
        this.databaseConnection = dataaccess_1.DataAccess.connect();
    };
    return RetroServer;
}());
RetroServer.bootstrap();
