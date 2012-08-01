(function() {
  var QRefDatabase, mongoose;

  mongoose = require('mongoose');

  QRefDatabase = (function() {

    QRefDatabase.prototype.connection = null;

    QRefDatabase.prototype.url = 'mongodb://qref:qref@localhost/qref';

    QRefDatabase.prototype.Users = null;

    QRefDatabase.prototype.AuthTokens = null;

    QRefDatabase.prototype.Roles = null;

    QRefDatabase.prototype.RecoveryQuestions = null;

    QRefDatabase.prototype.Schema = mongoose.Schema;

    function QRefDatabase() {
      this.connection = mongoose.createConnection(this.url);
      this.initialize();
    }

    QRefDatabase.prototype.initialize = function() {
      var AuthTokenSchema, RecoveryQuestionSchema, RoleSchema, UserSchema;
      RoleSchema = require('../schema/RoleSchema');
      this.Roles = this.connection.model('user.roles', RoleSchema);
      RecoveryQuestionSchema = require('../schema/RecoveryQuestionSchema');
      this.RecoveryQuestions = this.connection.model('user.recovery.questions', RecoveryQuestionSchema);
      UserSchema = require('../schema/UserSchema');
      this.Users = this.connection.model('users', UserSchema);
      AuthTokenSchema = require('../schema/AuthTokenSchema');
      return this.AuthTokens = this.connection.model('user.tokens', AuthTokenSchema);
    };

    QRefDatabase.prototype.getConnection = function() {
      return this.connection;
    };

    QRefDatabase.prototype.getUrl = function() {
      return this.url;
    };

    return QRefDatabase;

  })();

  module.exports = QRefDatabase;

}).call(this);
