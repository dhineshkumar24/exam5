var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

BitlaProvider = function(host, port) {
  this.db= new Db('yatragenie', new Server(host, port), {safe: false}, {auto_reconnect: true}, {});
  this.db.open(function(){  });
};


BitlaProvider.prototype.getCollection= function(callback) {
  this.db.collection('BITLA_DAILY_INVENTORY', function(error, bitla_collection) {
    if( error ) callback(error);
    else callback(null, bitla_collection);
  });
};

//find all bitlas
BitlaProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, bitla_collection) {
      if( error ){} //callback(error)
      else {
        bitla_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
        this.db.close();
      }
    });
};



//find using condition
BitlaProvider.prototype.findCondition = function(startCity, endCity, callback) {
    this.getCollection(function(error, bitla_collection) {
      if( error ) {}//callback( error )
      else {
        bitla_collection.find({$or: [{startCityName: startCity, endCityName: endCity},{startCityNameSmall: startCity, endCityNameSmall: endCity},{startCityName: startCity, endCityNameSmall: endCity},{startCityNameSmall: startCity, endCityName: endCity}]}).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
        this.db.close();
      }
    });
//    this.db.close(); 
};


exports.BitlaProvider = BitlaProvider;
