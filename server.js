const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const port = 5000;
const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

var myemail = process.env.GMAIL_USER;
var mypassword = process.env.GMAIL_PASS;

function sendEmail({ email, subject, message, name }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
    //   secure: true, // true for 465, false for other ports
    //   port: 465,
    //   requireTLS: true,
      auth: {
        user: myemail,
        pass: mypassword,
      },
    });

   
    const mail_configs = {
      from: myemail,
      to: process.env.GMAIL_USER,  //To and from are same
      subject: subject,
      // text: "Hi Jaya",
      html: `<b>Hi Jaya,</b><br/><br/><b>There is a message for you from ${name}.</b><br/><br/><b>The message is "${message}".</b><br/><br/><b>To reply use mail id ${email}.</b><br/><br/><b>Best Regards,<br><b>JJ Team`
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfully" });
    });
  });
}

app.post("/api/send-email", (req, res) => {
 
  sendEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.listen(port, () => {
  console.log(`nodemailer is listening at http://localhost:${port}`);
});
