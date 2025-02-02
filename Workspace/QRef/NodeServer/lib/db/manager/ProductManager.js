(function() {
  var ProductManager, QRefDatabase, async, mongoose,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  async = require('async');

  mongoose = require('mongoose');

  QRefDatabase = require('../QRefDatabase');

  /*
  Utility class used to provide common operations on {ProductSchemaInternal} object instances.
  @author Nathan Klick
  @copyright QRef 2012
  */


  ProductManager = (function() {
    /*
    	Creates a new instance of the ProductManager class.
    */

    function ProductManager() {
      this.expandAll = __bind(this.expandAll, this);

    }

    /*
    	Performs deep property population on a single {ProductSchemaInternal} object.
    	@param product [ProductSchemaInternal] The object to deeply populate.
    	@param callback [Function] A function meeting the {Callbacks#managerExpandItemCallback} requirements.
    */


    ProductManager.prototype.expand = function(product, callback) {
      var db, eProd;
      db = QRefDatabase.instance();
      if (!(product != null)) {
        callback('Product cannot be null', null);
        return;
      }
      if (product.toObject != null) {
        eProd = product.toObject();
      } else {
        eProd = product;
      }
      if (eProd.productCategory === 'aviation' && eProd.productType === 'checklist') {
        return async.parallel([
          function(cb) {
            if (!(eProd.manufacturer != null)) {
              cb(null);
              return;
            }
            return db.AircraftManufacturer.findById(eProd.manufacturer).exec(function(err, mfr) {
              if (err != null) {
                cb(err);
              }
              if (!(mfr != null)) {
                cb('Not Found');
              }
              eProd.manufacturer = mfr.toObject();
              return cb(null);
            });
          }, function(cb) {
            if (!(eProd.model != null)) {
              cb(null);
              return;
            }
            return db.AircraftModel.findById(eProd.model).exec(function(err, mdl) {
              if (err != null) {
                cb(err);
              }
              if (!(mdl != null)) {
                cb('Not Found');
              }
              eProd.model = mdl.toObject();
              return cb(null);
            });
          }
        ], function(err, results) {
          if (err != null) {
            callback(err, null);
            return;
          }
          return callback(null, eProd);
        });
      } else {
        return callback(null, eProd);
      }
    };

    /*
    	Performs deep property population on an array of {ProductSchemaInternal} objects.
    	@param arrProducts [Array<ProductSchemaInternal>] The array of objects to deeply populate.
    	@param callback [Function] A function meeting the {Callbacks#managerExpandArrayCallback} requirements.
    */


    ProductManager.prototype.expandAll = function(arrProducts, callback) {
      var eArrProducts,
        _this = this;
      if (!(arrProducts != null)) {
        callback('Array cannot be a null reference', null);
      }
      eArrProducts = [];
      return async.forEach(arrProducts, function(item, cb) {
        return _this.expand(item, function(err, newItem) {
          if (err != null) {
            cb(err);
            return;
          }
          eArrProducts.push(newItem);
          return cb(null);
        });
      }, function(err) {
        if (err != null) {
          callback(err, null);
          return;
        }
        return callback(null, eArrProducts);
      });
    };

    return ProductManager;

  })();

  module.exports = ProductManager;

}).call(this);
