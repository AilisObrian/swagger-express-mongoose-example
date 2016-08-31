Place your controllers in this directory.

```javascript
'use strict';

const mongoose = require('../../app').mongoose;
const HTTPError = require('http-errors');
const errorHandler = require('../helpers/ErrorHandler.js');

const SAMPLEModel = mongoose.model('Sample');

module.exports = {
  getByID: (req, res) => {
    const ID = req.swagger.params.ID.value;
    SAMPLEModel.findById(ID).lean().exec()
        .then(foundSample => {
          if (foundSample === null) {
            throw HTTPError[404]();
          }
          res.json(foundSample);
        })
        .catch(errorHandler(res));
  },
};
```
