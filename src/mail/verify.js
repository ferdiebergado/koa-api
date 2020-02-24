/* eslint-disable no-useless-catch */
const nunjucks = require('nunjucks');
const { send } = require('./mailer');

const port = process.env.PORT ? `:${process.env.PORT}` : '';

module.exports = {
  sendVerification: (username, email, token) => {
    const data = {
      username,
      link: `${process.env.PROTO}://${process.env.HOST}${port}/api/auth/verify/${token}`
    };
    const env = nunjucks.configure('src/mail/templates', { autoescape: true });
    const html = env.render('verification.njk', { data });
    send(email, 'Verify your account', html);
  },

  sendPasswordRecovery: (email, token) => {
    const data = {
      link: `${process.env.PROTO}://${process.env.HOST}${port}/api/auth/password/reset/${token}`
    };
    const env = nunjucks.configure('src/mail/templates', { autoescape: true });
    const html = env.render('recoverPassword.njk', { data });
    send(email, 'Recover your account', html);
  },

  sendVerificationSuccess: (username, email) => {
    const data = {
      username
    };
    const env = nunjucks.configure('src/mail/templates', { autoescape: true });
    const html = env.render('verificationSuccess.njk', { data });
    send(email, 'Verification successful', html);
  }
};
