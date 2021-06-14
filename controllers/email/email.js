const nodemailer = require('nodemailer');
const config = require('./../../config/config');

module.exports = class EmailClass { 
  
  constructor() {}

  async send(recipients, subject, body) {
    let transporter = nodemailer.createTransport({
      host: 'mail.wager.com.ng', //"smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: 'noreply@wager.com.ng',
        pass: config.server.email_pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    const mailOptions = {
      from: 'Wager <noreply@wager.com.ng>',
      to: recipients,
      subject: subject,
      html: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
        return false;
      } else {
        console.log(info)
        return true;
      }
    })
  }

  async SendNewPasswordLink(user) {
    // console.log(user)

    // send account activation mail
    // http://kudutask.com/signup/${user._id}
    // http://localhost:4200/signup/${user._id}

    // email body
    const emailBody = `
    <h1>New Password Link</h1>
    <p> Hi ${user.lastname},</p>
    <p>Kindly use the link below to change your account password</p>
    <br>
    <a href="http://localhost:4200/new-password/${user._id}" target="_blank" 
        style="background-color: #1d2038; 
        color: white; 
        padding: 15px 32px;
        text-decoration: none;
        text-align: center;
        border: 1px solid gray; 
        font-size: 16px;
        text-transform: uppercase;
        display: inline-block;">Change Password</a>
    <p>From Wager</p> `;

    // init
    const emailClass = new EmailClass();
    // send email
    const sendEmailPromise = await emailClass.send(user.email, 'Password Reset', emailBody);
    const isEmailSent = await sendEmailPromise.then((status) => { return status });

    //console.log(isEmailSent)

    // check if email is sent
    if (isEmailSent) {
      return true
    } else {
      return false
    }
  }

}