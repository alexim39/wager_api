const nodemailer = require('nodemailer');
const config = require('./../../config/config');

module.exports = class EmailClass { 
  
  constructor() {}

  send(recipients, subject, body) {
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
        //console.log(error)
        return false;
      } else {
        //console.log(info)
        return true;
      }
    })
  }

  SendNewPasswordLink(user) {
    // console.log(user)

    // send account activation mail
    // http://wager.com.ng/signup/${user._id}
    // http://localhost:4200/signup/${user._id}

    // email body
    const emailBody = `
    <h2>New Password Link</h2>
    <p> Hi ${user.lastname.toUpperCase()},</p>
    <p>Kindly use the link below to change your account password</p>
    <br>
    <a href="http://wager.com.ng/new-password/${user._id}" target="_blank" 
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
    const sendEmailPromise = emailClass.send(user.email, 'Password Reset Link', emailBody);
    //const isEmailSent = await sendEmailPromise.then((status) => { return status });

    //console.log(sendEmailPromise)

    // check if email is sent
    if (sendEmailPromise) {
      return true
    } else {
      return false
    }
  }

  SendPasswordChangeUpdate(user) {

    // email body
    const emailBody = `
    <h2>Password Reset Successful</h2>
    <p> Hi ${user.lastname.toUpperCase()},</p>
    <p>Your password have been successfully changed.</p>
    <p>From Wager</p> `;

    // init
    const emailClass = new EmailClass();
    // send email
    const sendEmailPromise = emailClass.send(user.email, 'Password Reset', emailBody);
    // check if email is sent
    if (sendEmailPromise) {
      return true
    } else {
      return false
    }
  }


  SendAccountActivationLink(user) {

    // email body
    const emailBody = `
    <h2>Welcome To Wager</h2>
    <p> Hi ${user.lastname.toUpperCase()},</p>
    <p>Kindly use the link below to activate your account, as this will enable you get full access to all features in the platform</p>
    <br>
    <a href="http://wager.com.ng/signup/${user._id}" target="_blank" 
        style="background-color: #1d2038; 
        color: white; 
        padding: 15px 32px;
        text-decoration: none;
        text-align: center;
        border: 1px solid gray; 
        font-size: 16px;
        text-transform: uppercase;
        display: inline-block;">Activate Account</a>
    <p>From Wager</p> `;

    // init
    const emailClass = new EmailClass();
    // send email
    const sendEmailPromise = emailClass.send(user.email, 'Account Activation Link', emailBody);
    // check if email is sent
    if (sendEmailPromise) {
      return true
    } else {
      return false
    }
  }

  SendWelcomeMsg(user) {

    // email body
    const emailBody = `
    <h2>Welcome To Wager</h2>
    <p> Hi ${user.lastname.toUpperCase()},</p>
    <p>Welcome to Wager, an online platform that helps you grow wealth through a gradual process.</p>
    <p>Our goal is to help you grow passive wealth.</p>
    <p>From Wager</p> `;

    // init
    const emailClass = new EmailClass();
    // send email
    const sendEmailPromise = emailClass.send(user.email, 'Account Activation', emailBody);
    // check if email is sent
    if (sendEmailPromise) {
      return true
    } else {
      return false
    }
  }

}