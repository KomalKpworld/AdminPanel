'use strict';

/**
 * manage-vedio controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
  "api::manage-vedio.manage-vedio",
  ({ strapi }) => ({
    async create(ctx) {

      var id = ctx.state.auth.credentials.username;
      let response = await strapi.entityService.create("api::manage-vedio.manage-vedio", {
        data: {
          CId: ctx.request.body.data.CId,
          VideoName: ctx.request.body.data.VideoName,
          Zip: ctx.request.files?.Zip,
          VideoThumbnail: ctx.request.files?.VideoThumbnail,
          PreviewVideo: ctx.request.files?.PreviewVideo,
          NotificationImage: ctx.request.files?.NotificationImage,
          NotificationDescription: ctx.request.body.data.NotificationDescription,
          TotalImage: ctx.request.body.data.TotalImage,
          Status: ctx.request.body.data.Status,
          AddedBy: id,
          VideoResolution: ctx.request.body.data.VideoResolution,
          AppId: ctx.request.body.data.AppId,
          Date: ctx.request.body.data.Date,
          VedioCount: 1,
        },
      })
      // some logic

      //const response = await super.create(ctx);
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
    async find(ctx) {

      ctx.query = { ...ctx.query, local: 'en' };
      const { data, meta } = await super.find(ctx);
      meta.date = Date.now();
      return { data, meta };
    },
    async findOne(ctx) {
      const { id } = ctx.params;
      const { query } = ctx;
      const entity = await strapi.service('api::manage-vedio.manage-vedio').findOne(id, query);
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
      return this.transformResponse(sanitizedEntity);
    },
    async findMany(ctx) {
      let findVedio = strapi.query('api::manage-vedio.manage-vedio').findMany(

        {
          select: ['id', 'VideoName', 'NotificationDescription', 'TotalImage', 'Status', 'AddedBy', 'VideoResolution'],
          populate: {
            AppId: {
              select: ['id']
            },
            CId: {
              select: ['id']
            },
            Zip: {
              select: ['url']
            },
            VideoThumbnail: {
              select: ['url']
            },
            PreviewVideo: {
              select: ['url']
            },
            NotificationImage: {
              select: ['url']
            }
          }
        }
      );

      return findVedio
    },

    async findByDate(ctx) {

     let response = await strapi.query('api::manage-vedio.manage-vedio').
     
  findMany({ where: {
    AppId: ctx.request.body.data.AppId,
    Date: ctx.request.body.data.Date,
  },
  
    select: ['AddedBy'] ,
    populate:{
      AppId:{
      select:['AppName']
      }
      },
 },)//.count();
return [response , response.length]
}




  }))