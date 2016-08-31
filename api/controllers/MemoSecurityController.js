'use strict';

const bcrypt = require('bcryptjs');

const tokenHelper = require('../helpers/TokenHelper.js');
const HTTPError = require('http-errors');
const errorHandler = require('../helpers/ErrorHandler.js');

const _verifyUserKey = 'developer-user preview';
const _verifyAdminKey = 'developer-admin preview';

//const mongoose = require('../../app').mongoose;
//const UserModel = mongoose.model('User');

const newUserToken = user => {
  return tokenHelper.newToken(
    {
      username: user.username,
    },
    _verifyUserKey
  );
};

const newAdminToken = user => {
  return tokenHelper.newToken(
    {
      username: user.username,
    },
    _verifyAdminKey
  );
};

module.exports = {
  isUserToken: tokenHelper.isValidToken(_verifyUserKey),
  isAdminToken: tokenHelper.isValidToken(_verifyAdminKey),
  isAnonymousToken: tokenHelper.bypassToken(),
  postUser: (req, res) => {
    const _username = req.swagger.params.credential.value.username;
    const _password = req.swagger.params.credential.value.password;

    UserModel.findOne({username: {$eq: _username}}).lean().exec()
        .then(found => {
          if (found === null) {
            throw HTTPError[401]("Unexpected Credentials");
          }
          return found;
        })
        .then(found => {
          if (bcrypt.compareSync(_password, found.password) !== true) {
            throw HTTPError[401]("Unexpected Credentials");
          }
          return found;
        })
        .then(found => {
          res.status(200);
          if (found.isAdmin === true) {
            res.send({
              token: newAdminToken(found),
            });
          } else {
            res.send({
              token: newUserToken(found),
            });
          }
        })
        .catch(errorHandler(res));
  },
  putUser: (req, res) => {
    const _username = req.swagger.params.credential.value.username;
    const _password = req.swagger.params.credential.value.password;
    const _nickname = req.swagger.params.credential.value.nickname;

    UserModel({username: _username, password: bcrypt.hashSync(_password), nickname: _nickname}).save()
        .then(saved => {
          ret.json(saved);
        })
        .catch(errorHandler(res));
  },
}
