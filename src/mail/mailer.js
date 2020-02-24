const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const nunjucks = require('nunjucks');

module.exports = {
  send: (to, subject, template, data) => {
    const start = new Date();
    console.log('Sending email...');
    const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, MAIL_FROM, NODE_ENV } = process.env;
    const Oauth2 = google.auth.OAuth2;
    const oauth2Client = new Oauth2(
      CLIENT_ID,
      CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );
    let refreshToken = REFRESH_TOKEN;

    oauth2Client.on('tokens', tokens => {
      if (tokens.refresh_token) {
        // store the refresh_token in my database!
        refreshToken = tokens.refresh_token;
      }
      // console.log('access_token: ', tokens.access_token);
    });

    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });

    const accessToken = oauth2Client.getAccessToken();
    const smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: MAIL_FROM,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken,
        accessToken
      }
    });
    const env = nunjucks.configure('src/mail/templates', { autoescape: true });
    const html = env.render(template, { data });
    const mailOptions = {
      from: MAIL_FROM,
      to,
      subject,
      generateTextFromHTML: true,
      html
    };

    smtpTransport.sendMail(mailOptions, (error, _response) => {
      if (error) throw error;
      // console.log(response);
      if (NODE_ENV !== 'test') console.log(`Email sent in ${new Date() - start} ms.`);
      smtpTransport.close();
    });
  }
};
