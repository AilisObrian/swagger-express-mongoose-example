'use strict';

const HTTPErrorBase = require('http-errors').HttpError;
const MongooseErrorBase = require('mongoose/lib/error');
// const JWTErrorBase = require('jsonwebtoken').JsonWebTokenError;
const newrelic = require('newrelic');

module.exports = res => {
  return err => {
    newrelic.noticeError(err, {});

    let statusCode;
    let base;
    if (err instanceof HTTPErrorBase) {
      base = "HTTPErrorBase";
      statusCode = err.status;
    } else if (err instanceof MongooseErrorBase) {
      base = "MongooseErrorBase";
      statusCode = 503;
    } else {
      base = "Swagger";
      statusCode = 400;
    }

    res.status(statusCode).json({
      base: base,
      name: err.name,
      message: err.message,
      statusCode: statusCode,
    });
  };
};
