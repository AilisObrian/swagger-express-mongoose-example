'use strict';

const newrelic = require("newrelic");

module.exports = fittingDef => {
  return (context, next) => {
    newrelic.setTransactionName(
        context.request.swagger.operation.pathObject['x-swagger-router-controller'] +
        "/" + context.request.swagger.operation.operationId
    );
    next();
  };
};
