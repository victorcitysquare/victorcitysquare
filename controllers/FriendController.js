//This Controller deals with all functionalities of Student

function friendController() {

    var that = this;
    var users = require('../models/usersSchema');
    var generalResponse = require('./GeneralResponse');
    var mongoose = require('../db').mongoose;


    that.addFriend = function (req, res, next) {


        users.update({email: req.body.email},
            {
                $push: {
                    friends: req.body.friend
                }
            }, function (err, user) {


                if (err)
                    return res.send(generalResponse.sendFailureResponse("Error Occured while adding new friend", 400, error));
                else if (user) {
                    console.log("usercontroller().addFriend() =>user", user)
                    return res.send(generalResponse.sendSuccessResponse("Friend was added successfuly!", 200, user));
                }
                else {
                    return res.send(generalResponse.sendFailureResponse("Error Occured :incorrect email", 400, null));
                }

            });
        return next();

    };

    that.unFriend= function (req, res, next) {

        var query={email:req.body.email};

        users.findOneAndUpdate(query, {$pull: {friends:req.body.friend}}, function(err, data){
            if (err)
                return res.send(generalResponse.sendFailureResponse("UnFriend: Error Occured", 400, error));
            else {
                return res.send(generalResponse.sendSuccessResponse(req.body.friend+" was unfriended successfuly", 200, data));
            }

        });

        next();
    }

    that.searchFriend = function (req, res, next) {
        users.find({
            email: req.params.email
        }, function (err, data) {
            if (err)
                return res.send(generalResponse.sendFailureResponse("searchFriend: Error Occured", 400, error));
            else {
                return res.send(generalResponse.sendSuccessResponse("searchFriend: Successful", 200, data));
            }
        });
        return next();
    };

    that.getFriendListByEmail = function (req, res, next) {

        var friendList = [];
        var userEmails=[];
        users.findOne({email: req.params.email}, function (err, data) {
            if (err) {
                return next(err);
            }
            else if (data!=null) {


                users.find({ "email": { "$in": data.friends }}, function (err, result) {


                    if (err)
                        return res.send(generalResponse.sendFailureResponse("Error Occured while adding new friend", 400, error));
                    else if (result) {
                        console.log("usercontroller().addFriend() =>user", result)
                        return res.send(generalResponse.sendSuccessResponse("Friend was added successfuly!", 200, result));
                    }
                    else {
                        return res.send(generalResponse.sendFailureResponse("Error Occured :incorrect email", 400, null));
                    }

                });
            }

            else{
                return res.send(generalResponse.sendFailureResponse("incorrect email ", 200, null));
            }

        });

        next();
    };

};


module.exports = new friendController();