'use strict';

/* eslint-disable camelcase, no-unused-vars */
// system-wide packages
const __path_join__ = require('path').join;


// npm-wide packages
require('newrelic');  // eslint-disable-line no-unused-vars
const __express__ = require('express');

const app = __express__();
{
  app.use(__express__.static('root'));
  app.set('etag', false);
}
const mongoose = require('mongoose');
{
  mongoose.Promise = global.Promise;
  mongoose.plugin(require('mongoose-delete'), {deletedAt: true, overrideMethods: true, indexFields: true});
}
const swagger = require('swagger-express-mw');


// local-wide packages
const __TokenController__ = require(__path_join__(__dirname, '/api/controllers/LockedController.js'));
const __MemoTokenController__ = require(__path_join__(__dirname, '/api/controllers/MemoSecurityController.js'));

/* eslint-enable camelcase, no-unused-vars */


module.exports = {app, mongoose, swagger};

swagger
    .create({
      appRoot: __dirname,
      swaggerSecurityHandlers: {
        locked: __TokenController__.isLocked,
        memo_admin: __MemoTokenController__.isAdminToken,
        memo_user: __MemoTokenController__.isUserToken,
        memo_anonymous: __MemoTokenController__.isAnonymousToken,
      },
    }, (err, swaggerExpress) => {
      if (err) {
        throw err;
      }

      swaggerExpress.register(app);
      require('swagger-mongoose-fork')
          .compile(swaggerExpress.runner.swagger);

      __mongodbConnect__()
          .on('error', console.log)
          .on('disconnected', __mongodbConnect__)
          .once('open', () => {
            const port = process.env.PORT || 10010;
            app.listen(port);
            console.log('try this:\ncurl http://127.0.0.1:' + port + swaggerExpress.runner.api.basePath);
          });
    });

/**
 * MongoDB Connect
 * @return {mongoose.Connection} Connected MongoDB
 */
function __mongodbConnect__() {
  const options = {
    server: {
      socketOptions: {
        keepAlive: 1,
      },
    },
  };
  const MongoDBConn = process.env.DB || "mongodb://localhost/app";
  return mongoose.connect(MongoDBConn, options).connection;
}
