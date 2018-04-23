var express = require('express');
var config = require('./config/index');
var port = config.build.port;

var app = express();
var router = express.Router();

router.get('/', function (req, res, next) {
    req.url = '/index.html';
    next();
})

app.use(router);
app.use(express.static('./dist'));

app.listen(port, function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Listening at http://localhost:' + port);
})