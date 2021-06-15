const express = require('express');
const router = express.Router();
const Signup = require('../controllers/auth/signup');
const Signin = require('../controllers/auth/signin');
const verifyToken = require('../controllers/verify-user')

// User signup
router.post('/signup', Signup.register)
// User signin
router.post('/signin', Signin.login)
// User signout
router.get('/signout', verifyToken, Signin.logout)
// User change password
//router.put('/password', Auth.create)
// user forgot password
router.put('/forgot-password', Signin.forgotPassword)
// new password
router.put('/new-password', Signin.createNewPassword)
// account activation process
router.get('/activate/:userId', Signup.activateAccount)
// resend activation link
router.get('/activation-link/:userId', Signup.resendAcountActivationLink)

module.exports = router;