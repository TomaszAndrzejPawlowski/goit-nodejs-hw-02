const formData = require("form-data");
const Mailgun = require("mailgun.js");
require("dotenv").config();

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: "api", key: MAILGUN_API_KEY });

const sendingEmails = (email, verificationToken) => {
  const messageData = {
    from: "noreply@gmail.pl",
    to: email,
    subject: "Verification",
    text: `Click the verification link: http://localhost:3000/api/users/verify/${verificationToken}`,
  };

  client.messages
    .create(MAILGUN_DOMAIN, messageData)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = sendingEmails;
