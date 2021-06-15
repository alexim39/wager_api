const { UserModel, SignInValidator } = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const Email = require('./../email/email');
const Notification = require('./../notification');


module.exports = class SignIn {

    // User signin
    static async login(req, res) {
        try {
           // validate inputs
           const signInValidatorError = await SignInValidator(req.body);
           if (signInValidatorError.message) return res.status(400).send(signInValidatorError.message);

           // check if email exist
           const user = await UserModel.findOne({ email: req.body.email });
           if (!user) return res.status(404).json({ msg: `No account exist for this email`, code: 404 });

           // check password
           const password = await bcrypt.compare(req.body.password, user.password);
           if (!password) return res.status(401).json({ msg: `Password validation failed`, code: 401, obj: user});

           jwt.sign({user}, config.server.token, {expiresIn: '10h'}, (error, token) => {
                if (error) return res.status(403).json({ msg: `Token authorizatin failed`, code: 403 });
                return res.status(200).json({ msg: `User signed in`, code: 200, obj: token });
           }); 
        } catch (error) {
            return res.status(500).json({ msg: `Sign in process failed`, code: 500 });
        }
    }

    // User forgot password
    static async forgotPassword(req, res) {
        try {
           // 1. confirm that email exist
           // 2. forward a change password link to user email

            // check if user already exist
            const user = await UserModel.findOne({ email: req.body.email });
            if (!user) return res.status(400).json({ msg: `This email does not exist in our system`, code: 400 });
            
            // send password reset link email
            const EmailClass = new Email();
            EmailClass.SendNewPasswordLink(user);


            return res.status(200).json({ msg: `Password reset link have been sent to your email`, code: 200});

            //if (isSendLink) return res.status(200).json({ msg: `Password reset link have been sent to your email`, code: 200});
            //return res.status(500).json({ msg: `Password link was not sent, something went wrong`, code: 500 });
             
           
        } catch (error) {
            return res.status(500).json({ msg: `Sign in process failed`, code: 500 });
        }
    }

     // User create new password
     static async createNewPassword(req, res) {
        try {
            const { password, userId } = req.body;
           // Check password length
           if (password.length < 8 ) {
                return res.status(404).json({ msg: `Password should be at least 8 characters`, code: 404 });
            }

             // Check if email exist
            const foundUser = await UserModel.findById(userId);
            if (!foundUser) return res.status(404).json({ msg: `No account exist for this user`, code: 404 });

            // hash password
           const salt = await bcrypt.genSalt(10);
           const hash = await bcrypt.hash(password, salt);

           foundUser.password = hash;
           foundUser.modifyDate = Date.now();
           foundUser.save();

           if (!foundUser) return res.status(404).json({ msg: `Error occured while changing password`, code: 404 });
           // create notification
           const NotificationClass = new Notification();
           const notificationPromise = NotificationClass.create({
               userId: userId,
               title: 'Password Change',
               body: `Your password was changed successfully.`,
               source: 'Password Process'
           });
           notificationPromise.then((notify) => {
               if (notify) {
                   //console.log('notification sent')
               };
           })

           // send password reset link email
           const EmailClass = new Email();
           EmailClass.SendPasswordChangeUpdate(foundUser);

           return res.status(200).json({ msg: `Password changed successfully`, code: 200, obj: foundUser });
             
        } catch (error) {
            return res.status(500).json({ msg: `Sign in process failed`, code: 500 });
        }
    }

    // User signin
    static async logout(req, res) {
        try {
            jwt.verify(req.token, config.server.token, (error, authData) => {
                if (error) return res.status(403).json({ msg: `Invalid access request`, code: 403 });
                //res.status(200).json({ msg: `User is authorized`, code: 200, obj: authData.user });
                return res.status(200).json({ msg: `User signed out`, code: 200}); 
            })
        } catch (error) {
            return res.status(500).json({ msg: `Contact creation process failed`, code: 500 });
        }
    }

}