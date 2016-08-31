'use strict';

const HTTPError = require('http-errors');
const jwt = require('jsonwebtoken');

/**
 * tokenVerifyPromise
 * @param {string} token "Bearer 000000000"
 * @param {string} verifyKey "verifyKey"
 * @return {Promise} is JWT `token` verified with `verifyKey` or not?
 */
function tokenVerifyPromise(token, verifyKey) {
  return new Promise((resolve, reject) => {
    if (token === undefined) {
      reject(HTTPError[401]('Authorization Header: Not Found'));
    }
    const tokens = token.split(' ');
    if (tokens[0] === 'Bearer') {
      // TODO [P2]: isRejected? 거절된 토큰인지 확인.
      jwt.verify(tokens[1], verifyKey, (err, verified) => {
        if (err) {
          reject(err);
        } else {
          resolve(verified);
        }
      });
    } else {
      reject(HTTPError[401]('Authorization Header: Not JsonWebToken'));
    }
  });
}

module.exports = {
  newToken: (data, verifyKey) => {
    // TODO [P1]: setExpiredAt. 만료일자 지정.
    // TODO [P2]: setScopes. 허가영역 지정.
    return jwt.sign(data, verifyKey);
  },
  isValidToken: verifyKey => {
    // TADA: swaggerSecurityHandler + tokenVerifyPromise.
    return (req, authOrSecDef, scopesOrApiKey, cb) => {
      tokenVerifyPromise(scopesOrApiKey, verifyKey)
          .then(verified => {
            req.security = {
              authOrSecDef: authOrSecDef,
              scopesOrApiKey: scopesOrApiKey,
              verified: verified,
            };
            cb();
          })
          .catch(err => {
            err.statusCode = 401;  // Unauthorized!
            // TADA: Raise 401, not 403!
            //       https://github.com/apigee-127/swagger-tools/issues/203

            cb(err);
          });
    };
  },
  bypassToken: () => {
    return (req, authOrSecDef, scopesOrApiKey, cb) => {
      if (scopesOrApiKey === "") {
        cb();
      } else {
        cb(HTTPError[401]('bypassToken Failed'));
      }
    };
  },
};
