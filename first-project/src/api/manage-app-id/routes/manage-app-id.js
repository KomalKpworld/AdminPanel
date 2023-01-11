'use strict';

/**
 * manage-app-id router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::manage-app-id.manage-app-id');
module.exports = {
    routes: [
      { // Path defined with an URL parameter
        method: 'POST',
        path: '/manage-app-id', 
        handler: 'manage-app-id.create',
        policies: []
      },
      { // Path defined with a regular expression
        method: 'GET',
        path: '/manage-app-id', 
        handler: 'manage-app-id.find',
        policies: []
      },
      
      { // Path defined with a regular expression
        method: 'GET',
        path: '/manage-app-id/:id', 
        handler: 'manage-app-id.findOne',
        policies: []
      },{ // Path defined with a regular expression
        method: 'PUT',
        path: '/manage-app-id/:id', 
        handler: 'manage-app-id.update',
        policies: []
      },

      { // Path defined with a regular expression
        method: 'DELETE',
        path: '/manage-app-id/:id', 
        handler: 'manage-app-id.delete',
        policies: []
      },
    //   { // Path defined with an URL parameter
    //     method: 'GET',
    //     path: '/commonVedio',
    //     handler: 'manage-app-id.findMany',
    //     policies: []
    // },
    ]
  }
  