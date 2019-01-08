var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');

var app = express();
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/gtm');

var corsOption = {
  origin: 'http://localhost:4200',
  credentials: true,
}

app.use(cors(corsOption));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var cardRoutes = require('./routes/card.routes.js')(app);
var columnRoutes = require('./routes/column.routes.js')(app);
var boardRoutes = require('./routes/board.routes.js')(app);

var server = app.listen(3000, function () {
    console.log('Server running at http://127.0.0.1:3000/');
});
