// const sgMail = require('@strapi/provider-email-sendgrid')
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
// let mailOptions = {
//   to: toAddress,
//   from: '"ZERTZ." <support@zertz.io>',
//   subject: "Please confirm your Email account",
//   html: html,
// };
// sgMail
//   .send(mailOptions)
//   .then(() => {

//   })
//   .catch((error) => {
//     console.error(error)
//   })