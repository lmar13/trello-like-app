var express = require('express')
    , morgan = require('morgan')
    , bodyParser = require('body-parser')
    , app = express()
    , port = process.env.PORT || 3000
    , router = express.Router()
    , log = require('./dev-logger.js')
    , cors = require('cors')
    , session = require('express-session');
    // , errorHandler = require('errorhandler');

var corsOption = {
  origin: 'http://localhost:4200',
  credentials: true,
}

app.use(cors(corsOption));

var server = require('http').createServer(app);

var ws = require('./ws.js')(server, true);

app.use(express.static(__dirname + '/dist')); // set the static files location for the static html
// app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
// You can set morgan to log differently depending on your environment
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('common', { skip: function(req, res) { return res.statusCode < 400 }, stream: __dirname + '/../morgan.log' }));
} else {
  app.use(morgan('dev', {skip: function(req, res) { return res.statusCode < 400 }}));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'trello-like-app',
    cookie: {
      maxAge: 60000
    },
    resave: false,
    saveUninitialized: false,
  })
)

router.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/dist/index.html');
});

// router.get('/b/:id', function(req, res, next) {
//     res.sendFile(__dirname + '/dist/index.html');
// });

app.use('/', router);

var mongoUri = process.env.MONGO_URI || 'mongodb://localhost/gtm';

console.log(mongoUri);
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(mongoUri, { useNewUrlParser: true }).then(function (db){
  // Provisional code, for runing db.dropDatabase() every sunday
    // if (new Date().getDay() == 0) {
    //   mongoose.connection.db.dropDatabase(function (){
    //     log('db droped');
    //   });
    // }
}).catch(function(err){
    log('Unabled to connect to mongodb err:', err);
    log('Check if MongoDB Server is running and available.');
});

var cardRoutes = require('./api/routes/card.routes.js')(app);
var columnRoutes = require('./api/routes/column.routes.js')(app);
var boardRoutes = require('./api/routes/board.routes.js')(app);
var userRoutes = require('./api/routes/user.routes.js')(app);
var passport = require('./api/config/passport.js');

server.listen(port, function () {
  log('App running on port', port);
});
