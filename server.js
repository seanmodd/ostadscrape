const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(
  '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'
);

const msg = {
  to: 'sean@senpex.com',
  from: 'seansmodd@gmail.com',
  subject: 'Test SendGrid Email Baby',
  text: 'This is awesome email sent from node app this is Sean Modd!',
};

sgMail.send(msg, function (err, info) {
  if (err) {
    console.log('Email Not Sent');
  } else {
    console.log('Email Sent Success');
  }
});
