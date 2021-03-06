const path = require('path'),
    restsDir = path.join(__dirname, './server/rests'),
    finelets = require('@finelets/hyper-rest'),
    moment = require('moment'),
    resourceDescriptors = finelets.rests.directoryResourceDescriptorsLoader.loadFrom(restsDir),
    resourceRegistry = finelets.rests.resourceRegistry,
    graph = require('./server/flow'),
    transitionsGraph = finelets.rests.baseTransitionGraph(graph, resourceRegistry),
    connectDb = finelets.db.mongoDb.connectMongoDb,
    sessionStore = finelets.session.mongoDb(1000 * 60 * 60), // set session for 1 hour
    appBuilder = finelets.express.appBuilder;

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

require('dotenv').config();
resourceRegistry.setTransitionGraph(transitionsGraph);

var app = function () {
    //配置view engine
    var viewEngineFactory = finelets.express.handlebarsFactory(
        //按缺省规约：
        // partials目录为path.join(__dirname, './client/views') + '/partials'
        // views文件扩展名为'.hbs'
        'hbs', path.join(__dirname, './client/views'),
        {
            helpers: {
                dateMMDD: function (timestamp) {
                    return moment(timestamp).format('MM-DD');
                },
                dateYYYYMMDD: function (timestamp) {
                    return moment(timestamp).format('YYYY-MM-DD');
                }
            }
        });

    appBuilder
        .begin(__dirname)
        .setViewEngine(viewEngineFactory)
        .setResources(resourceRegistry, resourceDescriptors)
        .setWebRoot('/website', './client/public')
        .setFavicon('client/public/images/favicon.jpg')
        .setSessionStore(sessionStore)
        .end();

    connectDb(function () {
        logger.info('connect mongodb success .......');
        var server = appBuilder.run(function () {
            var addr = server.address();
            logger.info('the server is running and listening at ' + addr.port);
        });
    });
}();
