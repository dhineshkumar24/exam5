var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , BitlaProvider = require('./bitlaprovider').BitlaProvider
  , logger = require("./logger")
  , heapdump = require('heapdump');

var app = express();
var count = 0, count_search = 0;

//logger.debug("Overriding 'Express' logger");
//app.use(require('morgan')({ "stream": logger.stream }));

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/', function(req, res){
 res.render('index');
});

var bitlaProvider= new BitlaProvider('localhost',27017);

/*app.get('/', function(req, res){
  bitlaProvider.findAll(function(error, bitlas){
      res.render('index', {
            title: 'Bitla Search',
            BITLA_DAILY_INVENTORY:bitlas
        });
  });
});*/

app.get('/bitla/new', function(req, res){
  bitlaProvider.findAll(function(error, bitlas){
      res.render('bitla_new', {
            title: 'Bitla Buses',
            BITLA_DAILY_INVENTORY:bitlas
        });
  });
});

app.post('/', function(req,res){
  count++;
  console.log("Count : "+count);
  this.name = req.param('start');
  this.city = req.param('end');
  res.redirect('/bitla/edit');
});


app.get('/bitla/edit', function(req, res){
 count_search++;
  console.log("Count_Search : "+count_search);  
bitlaProvider.findCondition(this.name, this.city, function(error, bitlas){
      res.render('bitla_edit', {
            title: 'Bitls Bus Results',
            BITLA_DAILY_INVENTORY:bitlas
        });
  });
});

app.listen(process.env.PORT || 3000);
