'use strict';

module.exports = {
  get: (req, res) => {
    const util = require('util');
    const basePath = req.swagger.operation.api.basePath || '/';
    const swaggerPath = util.format('/swagger_ui/?url=%s/swagger', basePath);
    res.redirect(swaggerPath);
  },
};
