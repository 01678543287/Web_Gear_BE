const nodeMailer = require("nodemailer");

const config = {
  MAILER: process.env.MAIL_MAILER,
  HOST: process.env.MAIL_HOST,
  PORT: process.env.MAIL_PORT,
  USERNAME: process.env.MAIL_USERNAME,
  PASSWORD: process.env.MAIL_APP_PASSWORD,
  ENCRYPTION: process.env.MAIL_ENCRYPTION,
  FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
  FROM_NAME: process.env.MAIL_FROM_NAME,
};

exports.sendMail = (to, subject, htmlContent) => {
  const transport = nodeMailer.createTransport({
    host: config.HOST,
    port: config.PORT,
    secure: true,
    auth: {
      user: config.USERNAME,
      pass: config.PASSWORD,
    },
  });

  const options = {
    from: config.FROM_ADDRESS,
    to: to,
    subject: subject,
    html: htmlContent,
  };

//   console.log(options, "options");
//   console.log(transport, "transport");

  return transport.sendMail(options);
};
