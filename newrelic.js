'use strict';
/* eslint-disable */

/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['swagger-express-mongoose-example'],
  /**
   * Your New Relic license key.
   */
  license_key: '',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info',
    enabled: false,
  },
  feature_flag: {
    express_segments: true
  },
  error_collector: {
    ignore_status_codes: [404, 409]
  }
}
