'use strict';

/**
 * manage-vedio router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::manage-vedio.manage-vedio');
module.exports = {
    routes: [
      { // Path defined with an URL parameter
        method: 'POST',
        path: '/manage-vedio', 
        handler: 'manage-vedio.create',
        policies: []
      },
      { // Path defined with a regular expression
        method: 'GET',
        path: '/manage-vedio', 
        handler: 'manage-vedio.find',
        policies: []
      },
      
      { // Path defined with a regular expression
        method: 'GET',
        path: '/manage-vedio/:id', 
        handler: 'manage-vedio.findOne',
        policies: []
      },{ // Path defined with a regular expression
        method: 'PUT',
        path: '/manage-vedio/:id', 
        handler: 'manage-vedio.update',
        policies: []
      },

      { // Path defined with a regular expression
        method: 'DELETE',
        path: '/manage-vedio/:id', 
        handler: 'manage-vedio.delete',
        policies: []
      },
    ]
  }
  