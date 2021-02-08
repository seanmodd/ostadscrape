const path = require('path');
const express = require('express');
const app = express();
const sendEmail = require('./utils/sendEmail');

app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('contact');
});

app.get('/sent', (req, res) => {
  res.render('sender');
});

app.post('/sendemail', (req, res) => {
  const { name, surname, email } = req.body;

  const from = 'seansmodd@gmail.com';
  const to = 'sean@senpex.com';
  const subject = 'New SendGrid Node FullStackJunkie Vid!';

  const output = `
  <p>You have a new Contact Request</p>
  <h3>Contact Details</h3>
  <ul>
    <li>Name: ${name}</li>
    <li>Surname: ${surname}</li>
    <li>Email: ${email}</li>
  </ul>
  `;

  sendEmail(to, from, subject, output);
  res.redirect('/sent');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// sgMail.setApiKey(
//   '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'
// );
