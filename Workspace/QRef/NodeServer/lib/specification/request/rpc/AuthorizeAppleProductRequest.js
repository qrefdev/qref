(function() {
  var AuthorizeAppleProductRequest, RpcRequest, exports,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  RpcRequest = require('../../../serialization/RpcRequest');

  /*
  Object sent as the body of an HTTP POST request to perform user authentication.
  @note The token property is not required when using this method.
  @author Nathan Klick
  @copyright QRef 2012
  */


  AuthorizeAppleProductRequest = (function(_super) {

    __extends(AuthorizeAppleProductRequest, _super);

    function AuthorizeAppleProductRequest() {
      return AuthorizeAppleProductRequest.__super__.constructor.apply(this, arguments);
    }

    /*
    	@property [ObjectId] Required - The ID of the product for which to authorize a purchase.
    */


    AuthorizeAppleProductRequest.prototype.product = null;

    /*
    	@property [String] Required - The base64 encoded receipt block from apple IAP libraries.
    */


    AuthorizeAppleProductRequest.prototype.receipt = null;

    /*
    	@property [String] Optional - The tailNumber to assign to the newly created checklist.
    */


    AuthorizeAppleProductRequest.prototype.tailNumber = null;

    return AuthorizeAppleProductRequest;

  })(RpcRequest);

  module.exports = exports = AuthorizeAppleProductRequest;

}).call(this);
