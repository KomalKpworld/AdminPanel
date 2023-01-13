module.exports = ({ env }) => (

  {
    

    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          service: 'Gmail',
          auth: {
            user: process.env.FROM,
            pass: process.env.EMAIL_PASS,
          },
          //apiKey: env('SENDGRID_API_KEY'),
        },

        settings: {
          defaultFrom: 'komalkpe@gmail.com',
          defaultReplyTo: 'komalkpe@gmail.com',
        },
      },
    },
    'raw-query': {
      enabled: true,
    },
    // ...
  });