const { setApiKey } = require('@sendgrid/mail');
require('dotenv').config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (to, from, subject, text) => {};
