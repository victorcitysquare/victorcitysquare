//This Controller deals with all functionalities of Student

function usersController() {

    var that = this;
    var users = require('../models/usersSchema');
    var generalResponse = require('./GeneralResponse');
    var bcrypt = require('bcrypt');

    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'victorcitysquare17@gmail.com',
            pass: '090078601!'
        }
    });

    // Register User
    that.register = function (req, res, next) {
        try {

            users.find({email: req.params.email}, function (err, result) {

                if (result.length > 0) {
                    return res.send(generalResponse.sendFailureResponse("User Already Registered With Given Email Address", 400, result));
                }
                else {

                    var user = {};
                    // Hash the password with the salt
                    var salt = bcrypt.genSaltSync(10);
                    user["hashKey"] = salt;

                    for (var n in req.params) {
                        //encrypt pass before inserting into db
                        if (n == "password")
                            user[n] = bcrypt.hashSync(req.params.password, salt);
                        else
                            user[n] = req.params[n];
                    }
                    users.create(
                        user
                        , function (err, result) {
                            if (err) {
                                console.log(err);
                                return res.send(generalResponse.sendFailureResponse("Error Occured While registering a user", 400, err));
                            }
                            else {

                                transporter.sendMail({
                                    to: user.email,
                                    subject: "Victor City Registration Success",
                                    text: "You have successfully registered to Victor City. Exploration of World is now on tip of your hand"
                                }, function (error, info) {
                                    if (error) {
                                        console.log("UtilController that.sendEmail() Email Send error ", error);
                                    } else {
                                        console.log('UtilController that.sendEmail() Email sent: ' + info.response);
                                    }
                                });

                                return res.send(generalResponse.sendSuccessResponse("Registration Was successful", 200, result));
                            }
                        });


                }
            });
            return next();


        }
        catch (ex) {
            console.log("Exception:" + ex);
            return res.send(generalResponse.sendFailureResponse("/register:Exception Occured", 400, ex));
        }
    };


    // Login
    that.login = function (req, res, next) {
        var email = req.params.email;
        var password = req.params.password;
        console.log("EMail " + email)
        console.log("Password " + password)


        users.findOne({email: email}, function (err, result) {

            console.log("result=" + result);
            console.log("err=" + err);
            if (err) {
                return res.send(generalResponse.sendFailureResponse("/login:error occured", 400, err));
            }
            else if (result) {
                //comparasison
                var salt = result.hashKey;
                var hash = result.password;
                var passwordHash = bcrypt.hashSync(password, salt);


                if (bcrypt.compareSync(password, hash)) {
                    // Passwords match
                    return res.send(generalResponse.sendSuccessResponse("/login: Successfull", 200, result));
                } else {
                    // Passwords don't match
                    return res.send(generalResponse.sendFailureResponse("Email or password do not match", 400, null));
                }
            }

            else   return res.send(generalResponse.sendFailureResponse("Email does not match", 400, null));
        });
        return next();
    };


    that.getUserList = function (req, res, next) {
        users.find(function (err, users) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(users));
        });
        return next();
    };

    that.getUserByEmail = function (req, res, next) {
        users.findOne({
            email: req.params.email
        }, function (err, data) {
            if (err)
                return res.send(generalResponse.sendFailureResponse("getUserByEmail: Error Occured", 400, error));
            else {
                return res.send(generalResponse.sendSuccessResponse("getUserByEmail: Successful", 200, data));
            }
        });
        return next();
    };
    that.updateUserProfile = function (req, res, next) {

        var query = {"email": req.body.email};
        var userData = {}; // updated user
        for (var n in req.params) {
            if (req.body[n]) {
                userData[n] = req.body[n];
                if (n == "password") {
                    var salt = bcrypt.genSaltSync(10);
                    userData[n] = bcrypt.hashSync(req.body.password, salt);
                    userData["hashKey"] = salt;
                }
            }
        }
        users.findOneAndUpdate(query, userData, {upsert: true}, function (err, data) {
            if (err)
                return res.send(generalResponse.sendFailureResponse("Error Occured", 400, error));
            else {
                return res.send(generalResponse.sendSuccessResponse("Record Was Updated Successfully", 200, data));
            }
        });
        return next();

    };


    that.deleteUserByEmail = function (req, res, next) {
        users.findOneAndRemove({
            email: req.params.email
        }, function (err, data) {
            if (err)
                return res.send(generalResponse.sendFailureResponse("Error Occured While deleting the user", 400, err));
            else if (data) {
                return res.send(generalResponse.sendSuccessResponse("user was deleted successful", 200, data));
            }
            else   return res.send(generalResponse.sendFailureResponse("user with email " + req.params.email + " does not exist", 404, err));

        });
        return next();

    };


// Forgot Password
    that.forgotPassword = function (req, res, next) {
        var token = that.randomString();

        console.log("userController.forgotPassword random 8 bit token="+token);
        users.findOneAndUpdate({email: req.params.email}, {verificationCode: token}, {upsert: true}, function (err, data) {
            if (err)
                return res.send(generalResponse.sendFailureResponse("Error Occured while saving verication code  in database", 400, error));
            else if (data) {

                transporter.sendMail({
                    to: req.params.email,
                    subject: "Forgot Password ",
                    text: "Don't worry, we all forget passwords! your temporary password is:  ".concat(token)
                }, function (error, info) {
                    if (error) {
                        return res.send(generalResponse.sendFailureResponse("Error Occured while sending forgot password email", 400, error));
                        console.log("forgotPassword().sendEmail() Email Send error ", error);
                    } else if (info) {
                        console.log('UtilController that.sendEmail() Email sent: ' + info.response);
                        return res.send(generalResponse.sendSuccessResponse("Temporary Password sent successfully at " + req.params.email, 200, data));

                    }
                });

            }

            else {

                console.log("UserController().forgotPassword()=>save verficaion code in database failure");
                return res.send(generalResponse.sendFailureResponse("Sorry,unable to send verification code", 200, data));
            }
        });
        return next();

    };


// Reset Password
    that.resetPassword = function (req, res, next) {


        var query = {email: req.body.email,verificationCode:req.body.verificationCode};
        var userData = {}; // updated user
        for (var n in req.params) {
            if (req.body[n]) {
                userData[n] = req.body[n];
                if (n == "password") {
                    var salt = bcrypt.genSaltSync(10);
                    userData[n] = bcrypt.hashSync(req.body.password, salt);
                    userData["hashKey"] = salt;
                }
            }
        }
        userData["verificationCode"] = "";
        users.findOneAndUpdate(query, userData, function (err, data) {
            if (err)
                return res.send(generalResponse.sendFailureResponse("Error Occured while saving new password  in database", 400, error));
            else if (data) {
                return res.send(generalResponse.sendSuccessResponse("Password was reset successfuly!", 200, data));
            }

            else {

                console.log("UserController().resetPassword()=>save verficaion code in database failure");
                return res.send(generalResponse.sendFailureResponse("Sorry,unable to send you verification code at your email address,please make sure you have entered correct code and email ", 200, data));
            }
        });
        return next();

    };
    that.randomString = function () {
        var length = 4;
        str = '';
       //  r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        r = '0123456789';
        for (var i = 0; i < length; i++) {
            str += r.charAt(Math.floor(Math.random() * r.length));
        }
        return str;
    };
};


module.exports = new usersController();