const { UserModel, ProfileUpdateValidator, BankUpdateValidator } = require('./../models/user');
const jwt = require('jsonwebtoken');
const config = require('./../config/config');

module.exports = class User {

    // get a user
    static async getUser(req, res) {
        try {
            jwt.verify(req.token, config.server.token, (error, authData) => {
                if (error) return res.status(403).json({ msg: `Invalid access request`, code: 403 });
                return res.status(200).json({ msg: `User is authorized`, code: 200, obj: authData.user }); 
            })
        } catch (error) {
            return res.status(500).json({ msg: `User access process failed`, code: 500 });
        }
    }

    // get a// users
    static async getUsers(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

           const users = await UserModel.find({ });
           if (!users) return res.status(404).json({ msg: `No users found`, code: 404 });
           return res.status(200).json({ msg: `users found`, code: 200, obj: users });

        } catch (error) {
            return res.status(500).json({ msg: `User access process failed`, code: 500 });
        }
    }

    // update a user profile
    static async updateUser(req, res) {
        try {
            jwt.verify(req.token, config.server.token);
            
            // validate inputs
            const profileUpdateValidatorError = await ProfileUpdateValidator(req.body);
            if (profileUpdateValidatorError.message) return res.status(400).send(profileUpdateValidatorError.message);

            const updatedUser = await UserModel.findByIdAndUpdate(req.body.userId, {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                about: req.body.about,
                modifyDate: Date.now()
            }, { new: true });

            if (updatedUser) return res.status(200).json({ msg: `User profile updated`, code: 200, obj: updatedUser });
            return res.status(404).json({ msg: `Profile update failed`, code: 404 });
        } catch (error) {
            return res.status(500).json({ msg: `User access process failed`, code: 500 });
        }
    }

    // get a user bank detail
    static async updateUserBank(req, res) {
        try {
            jwt.verify(req.token, config.server.token);
                
             // validate inputs
             const bankUpdateValidatorError = await BankUpdateValidator(req.body);
             if (bankUpdateValidatorError.message) return res.status(400).send(bankUpdateValidatorError.message);

             const updatedBankDetails = await UserModel.findByIdAndUpdate(req.body.userId, {
                bankName: req.body.bankName,
                accountNo: req.body.accountNo
            }, { new: true });

            if (updatedBankDetails) return res.status(200).json({ msg: `Bank details updated`, code: 200, obj: updatedBankDetails });
            return res.status(404).json({ msg: `Bank details update failed`, code: 404 });

        } catch (error) {
            return res.status(500).json({ msg: `User access process failed`, code: 500 });
        }
    }

    // delete a user
    static async deleteUser(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const user = await UserModel.findByIdAndDelete(req.params.userId);
            if (user) return res.status(200).json({ msg: `User profile deleted`, code: 200, obj: user });
            return res.status(404).json({ msg: `This user does not exist`, code: 404 });

        } catch (error) {
            return res.status(500).json({ msg: `User access process failed`, code: 500 });
        }
    }

}