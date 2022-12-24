'use strict';

/**
 * change-password service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::change-password.change-password');
