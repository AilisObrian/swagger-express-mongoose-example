'use strict';

const mongoose = require('../../app').mongoose;
const HTTPError = require('http-errors');
const errorHandler = require('../helpers/ErrorHandler.js');

const SAMPLEModel = mongoose.model('Sample');

module.exports = {
  getByID: (req, res) => {
    const _id = req.swagger.params._id.value;
    SAMPLEModel.findById(_id).lean().exec()
        .then(foundSample => {
          if (foundSample === null) {
            throw HTTPError[404]();
          }
          res.json(foundSample);
        })
        .catch(errorHandler(res));
  },
};
