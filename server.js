var express = require('express');

var app = express();
var server = require('http').createServer(app);

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.errorHandler());
    app.use(express.static(__dirname));
    app.use(app.router);
    require('./demo/demo-api')(app, __dirname);
});

module.exports = server;

// Override: Provide an "use" used by grunt-express.
module.exports.use = function () {
    app.use.apply(app, arguments);
};
