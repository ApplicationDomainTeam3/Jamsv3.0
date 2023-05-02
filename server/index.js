const sgMail = require("@sendgrid/mail");
const fs = require("fs");
const mustache = require("mustache");
const dotenv = require("dotenv");
const express = require("express");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, from, subject, _data, htmlPath) {
  const htmlSource = fs.readFileSync(htmlPath, "utf8");
  const timestamp = new Date().toISOString();
  const data = {
    timestamp,
    ..._data,
  };

  const html = mustache.render(htmlSource, data);

  const msg = {
    to,
    from,
    subject,
    html,
  };

  await sgMail
    .send(msg)
    .then((v) => console.log(v))
    .catch((e) => console.log(e));
}

async function testEmail() {
  const to = "meghanolson32@gmail.com";
  const from = "estestcode02@gmail.com";
  const subject = "Test Email";
  const data = {
    email_subject: subject,
    email_body: "This is a test email",
    email_button_text: "Click Me",
    email_user: "Megs",
  };

  await sendEmail(to, from, subject, data, "./emailform.html");
}
app.post("/send-email", async (req, res) => {
  const { to, from, subject, data } = req.body;
  const htmlPath = "./emailform.html";

  await sendEmail(to, from, subject, data, htmlPath);

  res.status(200).send("Email sent successfully");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//testEmail();