const { setApiKey } = require('@sendgrid/mail');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (to, from, subject, text) => {
  const msg = {
    to,
    from,
    subject,
    text,
  };
  sgMail.send(msg, function (err, result) {
    if (err) {
      console.log('Email Not Sent Error Occurred Now');
    } else {
      console.log('Email was Sent');
    }
  });
};

module.exports = sendEmail;
