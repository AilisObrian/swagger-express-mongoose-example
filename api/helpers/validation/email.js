'use strict';

const HTTPError = require('http-errors');
const isEmail = require('validator/lib/isEmail');

module.exports = {
  isWellFormedPromise: (email) => {
    return new Promise((resolve, reject) => {
      if (isEmail(email)) {
        resolve();
      } else {
        reject(HTTPError[412]("Malformed Email"));
      }
    });
  },
  isNotDuplicatedPromise: (userModel, email) => {
    return new Promise((resolve, reject) => {
      return userModel.findOne({email: {$eq: email}}).exec()
          .then((found) => {
            if (found === null) {
              resolve();
            } else {
              reject(HTTPError[409]("Duplicated Email"));
            }
          });
    });
  }
}

