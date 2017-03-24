const express = require('express');
const app = express(); 
const bot = require('./bot');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

var server = app.listen(process.env.PORT, "0.0.0.0", function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Web server started at http://%s:%s', host, port);
});


app.post('/' + bot.token, function (req, res) {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});
