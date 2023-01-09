'use strict';

/**
 * manage-vedio controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
  "api::manage-vedio.manage-vedio",
  ({ strapi }) => ({
    async create(ctx) {
      // some logic
      const response = await super.create(ctx);
      var findCategory = await strapi.db
        .query("api::manage-category.manage-category")
        .findMany({
          where: {
            id: ctx.request.body.data.CId,
          },
        });
      if (findCategory) {
        for (let i = 0; i < findCategory.length; i++) {

          const updateVideoCount = await strapi.db
            .query("api::manage-category.manage-category")
            .update({
              where: {
                id: findCategory[i].id,
              },
              data: {
                TotalVideo: findCategory[i].TotalVideo + 1,
              },
            });
        }
      }


      var id = ctx.state.auth.credentials.username;
      var entries = await strapi.db
        .query("api::video-status.video-status")
        .findOne({
          where: {
            UserName: id,
          },
        });


      if (entries) {
        var count = entries.VedioCount;

        const updateVideo = await strapi.db
          .query("api::video-status.video-status")
          .update({
            where: {
              UserName: id,
            },
            data: {
              VedioCount: count + 1,
            },
          });
      } else {

        strapi.entityService.create("api::video-status.video-status", {
          data: {
            UserName: ctx.state.user.username,
            VedioCount: 1,
          },
        });
      }

      return response;
    },

    async update(ctx) {

      const response = await super.update(ctx);
      return response;
    },
    async delete(ctx) {

      const response = await super.delete(ctx);
      return response;
    }

    ,


    // Method 2: Wrapping a core action (leaves core logic in place)
    async find(ctx) {
      // some custom logic here
      ctx.query = { ...ctx.query, local: 'en' };

      // Calling the default core action
      const { data, meta } = await super.find(ctx);

      // some more custom logic
      meta.date = Date.now();

      return { data, meta };
    },

    // Method 3: Replacing a core action
    async findOne(ctx) {
      const { id } = ctx.params;
      const { query } = ctx;

      const entity = await strapi.service('api::manage-vedio.manage-vedio').findOne(id, query);
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

      return this.transformResponse(sanitizedEntity);
    },


  })
)