'use strict';

const bcrypt = require('bcryptjs');

const tokenHelper = require('../helpers/TokenHelper.js');
const HTTPError = require('http-errors');
const errorHandler = require('../helpers/ErrorHandler.js');

const _verifyKey = 'developer-public preview';  // TODO: extracted it to enums/TokenVerifyKeys.js

const newLocked = user => {
  return tokenHelper.newToken(
    {
      email: user.email,
      userID: user._id.toString(),
    },
    _verifyKey
  );
};

module.exports = {
  isLocked: tokenHelper.isValidToken(_verifyKey),
  newLocked: newLocked,
  getLockFromDB: (email, password, UserModel, res) => {
    UserModel.findOne({email: {$eq: email}}).lean().exec()
        .then(found => {
          if (found === null) {
            throw HTTPError[401]("Unexpected Credentials");
          }
          return found;
        })
        .then(found => {
          if (bcrypt.compareSync(password, found.hash) !== true) {
            throw HTTPError[401]("Unexpected Credentials");
          }
          return found;
        })
        .then(found => {
          res.status(200);
          res.send({
            token: newLocked(found),
          });
        })
        .catch(errorHandler(res));
  },
  getLockFromFiles: (email, password, res) => {
    const checker = (__email__, __password__) => {  // scope only for isAdminMatch.
      var isAdminMatched = false;
      for (const admin of require("../enums/AdminPasswordEnum.js")) {
        if (__email__ === admin.email && __password__ === admin.password) {
          isAdminMatched = true;
          break;
        }
      }
      return isAdminMatched;
    };

    if (checker(email, password) === true) {
      res.status(200);
      res.send({
        token: tokenHelper.newToken(
          {
            email: email,
            fromFile: true,
          }, _verifyKey),
      });
    } else {
      res.status(401);
      res.send('Unauthorized: Wrong credentials');
    }
  },
};
