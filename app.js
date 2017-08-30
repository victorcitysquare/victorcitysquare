var restify = require('restify');
var config = require('./config');
var app = restify.createServer({name:'victor'});

app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.queryParser());

app.listen({
    port: process.env.PORT || 3000 || config.port,
    labels: ['api'],
})

var routes = require('./routes')(app);
var passport = require('./passport')(app);
//var chat= require('./chat')(app);