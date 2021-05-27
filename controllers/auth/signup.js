const { UserModel, SignUpValidator } = require('../../models/user');
const bcrypt = require('bcryptjs');
//const {EmailClass} = require('./../email/email')

module.exports = class SignUp {

    // User singup
    static async register(req, res) {
        try {

           // validate inputs
           const signUpValidatorError = await SignUpValidator(req.body);
           if (signUpValidatorError.message) return res.status(400).send(signUpValidatorError.message);

           // check if tnc is checked
           if (req.body.tnc === false) return res.status(400).json({ msg: `Please check the terms and condition box to continue`, code: 400 });

           // check if user already exist
           const userExist = await UserModel.findOne({ email: req.body.email });
           if (userExist) return res.status(400).json({ msg: `This email already exist, try resetting your password`, code: 400 });
            
            // hash password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);

            const user = await new UserModel({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hash,
                tnc: req.body.tnc
            }).save();

            if (!user) return res.status(404).json({ msg: `Account creation failed`, code: 404 });

            // send activation email
            //const email = new EmailClass();
            //email.sendAccountActivationLink(user);
            res.status(200).json({ msg: `Account created, check your email for activation link`, code: 200, obj: user });
            
  
        } catch (error) {
            return res.status(500).json({ msg: `Sign up process failed`, code: 500 });
        }
    }
}