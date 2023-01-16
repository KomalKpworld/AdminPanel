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
      var findApp = await strapi.db
        .query("api::manage-app.manage-app")
        .findMany({
          where: {
            id: ctx.request.body.data.AppId,
          },
        });
      if (findApp) {
        for (let i = 0; i < findApp.length; i++) {

          const updateVideoCount = await strapi.db
            .query("api::manage-app.manage-app")
            .update({
              where: {
                id: findApp[i].id,
              },
              data: {
                Count: findApp[i].Count + 1,
              },
            });
        }
      }
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

        findMany({
          where: {
            AppId: ctx.request.body.data.AppId,
            Date: ctx.request.body.data.Date,
          },
          select: ['AddedBy'],
        },)
      let user = []
      for (let i = 0; i < response.length; i++) {
        let user1 = await strapi.query('api::manage-vedio.manage-vedio').

          findWithCount({
            where: {
              AppId: ctx.request.body.data.AppId,
              Date: ctx.request.body.data.Date,
              AddedBy: response[i].AddedBy
            },

            select: ['AddedBy'],
            // populate: {
            //   AppId: {
            //     select: ['AppName']
            //   }
            // }
          },)
        user.push(user1)

      }
      return user.flat()

    },
    async getAllAppByDate(ctx) {

      let response = await strapi.query('api::manage-vedio.manage-vedio').

        findMany({
          where: {
            Date: ctx.request.body.data.Date,
          },
          select: ['AddedBy'],
          populate: {
            AppId: {
              select: ['Count']
            }
          }
        },)
      var date1 = ctx.request.body.data.Date
      var appid = ctx.request.body.data.AppId
 
      let getDashboardbyIdAndDate = await strapi.db.connection.raw(`SELECT added_by as userName ,  a.app_name,
      COUNT(CASE WHEN va.manage_app_id = a.id THEN a.count ELSE null END) AS Total
      FROM manage_vedios as v
      INNER JOIN 
          manage_vedios_app_id_links as va
           ON v.id = va.manage_vedio_id
          INNER JOIN manage_apps as a
           ON va.manage_app_id= a.id 
           WHERE v.date = "${date1}" AND a.id ="${appid}"
      
           Group BY  added_by`)
console.log(getDashboardbyIdAndDate[0])
      let getallAppByDate = await strapi.db.connection.raw(`SELECT added_by as userName ,  a.app_name,
      COUNT(CASE WHEN va.manage_app_id = a.id THEN a.count ELSE null END) AS Total
      FROM manage_vedios as v
      INNER JOIN 
          manage_vedios_app_id_links as va
           ON v.id = va.manage_vedio_id
          INNER JOIN manage_apps as a
           ON va.manage_app_id= a.id 
           WHERE v.date = "${date1}"
      
           Group BY v.added_by ,a.app_name`)


console.log(getallAppByDate [0])

      return response
    },
    async dashboardStatus(ctx){
      let findUser = await strapi.query('plugin::users-permissions.user').findMany({})
      let findVideoActiveStatus = await strapi.query('api::manage-vedio.manage-vedio').findMany({
        where: {
          Status: true
        }
      })
      let findDeActiveStatus = await strapi.query('api::manage-vedio.manage-vedio').findMany({
        where: {
          Status: false
        }
      })
      let totalUser = findUser.length
      let ActiveVideos = findVideoActiveStatus.length
      let InActiveVideos = findDeActiveStatus.length
      let totalvideo = findVideoActiveStatus.length + findDeActiveStatus.length
      return {data:{totalUser: totalUser, ActiveVideos: ActiveVideos, InActiveVideos: InActiveVideos, totalvideo: totalvideo} }
    }


  }))






















  // UNPIVOT
      // (
      //        SalesAmount
      //        FOR [Year] IN ([2005], [2006], [2007], [2008])
      // ) AS P
  //     let appid = ctx.request.body.data.AppId

  //     let d = await strapi.db.connection.raw(
  //       `SELECT v.added_by as "username" 

  //       FROM manage_vedios as v  
  //       INNER JOIN 
  //        manage_vedios_app_id_links as va
  //         ON v.id = va.manage_vedio_id
  //          INNER JOIN manage_apps as a 
  //          ON va.manage_app_id= a.id
  //          GROUP BY v.added_by `
  //     )


  //     let user = await strapi.db.connection.raw(`SELECT a.username, p.count

  //   FROM up_users as a, manage_apps as p, manage_vedios as v  , manage_vedios_app_id_links as va
  //   WHERE a.username = v.added_by AND p.status= 1
  //  GROUP BY a.username ,
  //       p.count   `)


  //     return response


  
